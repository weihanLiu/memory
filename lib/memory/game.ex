defmodule Memory.Game do 
  def new do
    %{
      showed: List.duplicate(" ", 16),
      tileValue: random_tileValue(),
      lastClicked: -1,
      clickedNum: 0,
    }
  end

  def client_view(game) do
    %{
      showed: game.showed,
      tileValue: game.tileValue,
      lastClicked: game.lastClicked,
      clickedNum: game.clickedNum
    }
  end

  def random_tileValue() do
    "ABCDEFGABCDEFG"
    |>String.graphemes
    |>Enum.shuffle
  end

  
  def exposeValue(game,i,last) do
    newShown = game.showed
              |> List.delete_at(i)
              |> List.insert_at(i, Enum.fetch(game.tileValue, i)
    game
    |>Map.put(:showed, newShown)
    |>Map.put(:lastClicked, last)
    |>Map.put(:clickedNum, game.clickedNum + 1)

  end

  def markCompleted(game, i, j) do
    newShown = game.showed
              |> List.delete_at(i)
              |> List.insert_at(i, "X")
              |> List.delete_at(j)
              |> List.insert_at(j, "X")
    game
    |>Map.put(:lastClicked, -1)
    |>Map.put(:showed, newShown)
    |>Map.put(:clickedNum, game.clickedNum + 1)

  end

  def hide(game, i, j) do
    newShown = game.showed
              |>List.delete_at(i)
              |>List.insert_at(i, " ")
              |>List.delete_at(j)
              |>List.insert_at(j, " ")
    game
    |>Map.put(:showed, newShown)
    |>Map.put(:lastClicked: -1)
    |>Map.put(:clickedNum: game.clickedNum + 1)
  end


  def click(game, i) do
    {:ok, letter} = Enum.fetch(game.showed, i)
    last = game.lastClicked
    cond do
      letter == " " -> 
        game
      last == -1 -> 
        exposeValue(game, i, i)
      Enum.fetch(game.tileValue, last) == Enum.fetch(game.tileValue, i) ->
        st1 = exposerValue(game, i, -1)
        st2 = markCompleted(game, last, i)
        [st1, st2]
      true ->
        st1 = exposeValue(i, -1)
        st2 = hide(last, i)
        [st1, st2]
    end
  end

  def gameover(game) do
    Enum.count(game.showed, &(&1 == "X")) == 16
  end


