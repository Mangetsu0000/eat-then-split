import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Mind",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Leg",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Torso",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  const handleSelectFriend = (friend) => {
    setSelectedFriend((_cSelectedFriend) =>
      _cSelectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  };

  const handleAddFriend = (friend) => {
    setFriends((_cFriends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSplitBill = (updatedBalance) => {
    setFriends((_cFriends) =>
      _cFriends.map((_friend) =>
        _friend.id === selectedFriend.id
          ? { ..._friend, balance: _friend.balance + updatedBalance }
          : _friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button
          onClick={() => {
            setShowAddFriend((_cShow) => !_cShow);
          }}
        >
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendsList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((_friend) => (
        <Friend
          friendObj={_friend}
          key={_friend.id}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friendObj, selectedFriend, onSelectFriend }) {
  const isSelected = friendObj.id === selectedFriend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{friendObj.name}</h3>
      {friendObj.balance < 0 && (
        <p className="red">
          You owe {friendObj.name} {Math.abs(friendObj.balance)}$
        </p>
      )}
      {friendObj.balance > 0 && (
        <p className="green">
          {friendObj.name} owes you {Math.abs(friendObj.balance)}$
        </p>
      )}
      {friendObj.balance === 0 && <p>You are even with your friend</p>}
      <Button onClick={() => onSelectFriend(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(evnt) => setName(evnt.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(evnt) => setImage(evnt.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [ownExpenses, setOwnExpenses] = useState("");
  const friendExpenses =
    !bill || !ownExpenses ? null : Number(bill) - Number(ownExpenses);
  const [payer, setPayer] = useState("user");

  const handleSubmit = (evnt) => {
    evnt.preventDefault();
    if (!bill || !ownExpenses) return;
    onSplitBill(payer === "user" ? friendExpenses : -ownExpenses);
  };
  return (
    <form action="" className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>Bill value 💵 </label>
      <input
        type="text"
        value={bill}
        onChange={(evnt) => {
          setBill(Number(evnt.target.value));
        }}
      />
      <label>Your expenses</label>
      <input
        type="text"
        value={ownExpenses}
        onChange={(evnt) => {
          setOwnExpenses(
            Number(evnt.target.value) > Number(bill)
              ? ownExpenses
              : Number(evnt.target.value)
          );
        }}
      />
      <label>{selectedFriend.name}'s expense </label>
      <input type="text" value={friendExpenses} disabled />
      <label>Who's paying? </label>
      <select
        name=""
        id=""
        value={payer}
        onChange={(evnt) => {
          setPayer(evnt.target.value);
        }}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
