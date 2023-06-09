import { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Rohan",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Aaron",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Aarav",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function onSelectFriend(friendObj) {
    setSelectedFriend((prev) => (prev?.id === friendObj.id ? null : friendObj));
    setShowFriend(false);
  }

  function onAddNewFriend(item) {
    setFriends((prev) => [...prev, item]);
    setShowFriend(false);
  }

  function toggleAddFriend() {
    setShowFriend((p) => !p);
  }

  function onSplitBill(value) {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddNewFriend={onAddNewFriend} />}
        <Button onClickHandler={toggleAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill selectedFriend={selectedFriend} onSplitBill={onSplitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            friend={friend}
            key={friend.id}
            onSelectFriend={onSelectFriend}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend && friend && selectedFriend.id === friend.id;

  return (
    <li
      onClick={onSelectFriend.bind(null, friend)}
      className={isSelected ? "selected" : ""}
    >
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe You {friend.balance}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>{selectedFriend?.id === friend.id ? "Close" : "Select"}</Button>
    </li>
  );
}

function Button({ children, onClickHandler }) {
  return (
    <button className="button" onClick={onClickHandler}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/150?img=49");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };

    setName("");
    onAddNewFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🙍‍♂️Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🅿️Image</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("");

  const friendExpense = billValue && yourExpense && billValue - yourExpense;

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? yourExpense : -yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        onChange={(e) => setBillValue(e.target.value)}
        value={billValue}
      />
      <label>👴🏽Your expense</label>
      <input
        type="text"
        onChange={(e) => setYourExpense(e.target.value)}
        value={yourExpense}
      />
      <label>🧑‍💻{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />
      <label>🤑Who is paying the bill</label>
      <select onChange={(e) => setWhoIsPaying(e.target.value)} value={whoIsPaying}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

export default App;
