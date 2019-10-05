defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) ||Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end


  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("click", %{"click" => i}, socket) do
    name = socket.assigns[:name]
    case Game.click(socket.assigns[:game], i) do
      [st1, st2] ->
        socket = assign(socket, :game, st1);
        BackupAgent.put(name, st2)
        Process.send_after(self(), {:update, st2}, 1000)
        {:reply, {:ok, %{ "game" => Game.client_view(st1)}}, socket}
      game ->
        socket = assign(socket, :game, game)
        BackupAgent.put(name, game)
        {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
    end
  end

  def handle_info({:update, game}, socket) do
    socket = assign(socket, :game, game);
    push(socket, "update", %{"game" => Game.client_view(game)})
    {:noreply, socket}
  end
    
  def handle_in("restart", payload, socket) do
    game = Game.new()
    name = socket.assigns[:name]
    socket = socket |>assign(:game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end


  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
