"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading/Loading";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [modalValues, setModalValues] = useState<any>({
    name: "",
    date: "",
    map: "",
  });

  const fetchSimpleCards = async () => {
    try {
      let res = await axios.get("http://localhost:3001/event-cards");
      let data = await res.data;
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handlePost = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    console.log(modalValues);
    try {
      let res = await axios.post(
        "http://localhost:3001/event-cards",
        modalValues
      );
      let data = await res.data;
      // console.log(data);
      fetchSimpleCards();
    } catch (err) {
      console.log(err);
    }
    setOpenModal(false);
  };

  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      let res = await axios.delete(`http://localhost:3001/event-cards/${id}`);
      let data = await res.data;
      fetchSimpleCards();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id2: any) => {
    try {
      let res = await axios.put(`http://localhost:3001/event-cards/${id2}`);
      let selectedPost = await res.data;
      setModalValues({
        name: selectedPost,
        date: selectedPost.date,
        map: selectedPost.map,
      });

      setOpenModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSimpleCards();
  }, []);

  return (
    <div className="container">
      <input
        type="text"
        className="w-[350px] rounded px-5 py-3 text-1xl border outline-none ms-[400px] mt-[80px]"
        placeholder="Buscar por um evento da Colo de Deus..."
        value={inputValue}
        onChange={(e) => handleChange(e)}
      />
      <img
        src="./New Event Button.svg"
        className="w-[70px] ms-[550px] mt-[50px] cursor-pointer"
        alt="Error"
        onClick={handlePost}
      />
      {openModal && (
        <div className="fixed top-1/4 left-1/3 w-96 h-80 bg-white border-2 z-10">
          <div className="p-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full ... ... mb-2 p-2 border outline-none"
              onChange={(e) =>
                setModalValues({ ...modalValues, name: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Date"
              className="w-full mb-2 ... p-2 border outline-none"
              onChange={(e) =>
                setModalValues({ ...modalValues, date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Map"
              className="w-full mb-2 p-2 border outline-none"
              onChange={(e) =>
                setModalValues({ ...modalValues, map: e.target.value })
              }
            />

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="cards grid grid-cols-3 gap-[150px] ms-[100px] relative">
        {posts.length > 0 ? (
          posts
            .filter((post: any) =>
              post.name?.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((post: any) => (
              <div
                key={post.id}
                className="card mt-[100px] bg-white shadow-md p-5  w-[300px]"
              >
                <div className="flex-class flex justify-between mb-5">
                  <img
                    src="./Trash Icon (Delete).svg"
                    className="cursor-pointer"
                    alt="Eror"
                    onClick={() => handleDelete(post.id)}
                  />
                  <img
                    src="./Edit Icon.svg"
                    className="cursor-pointer"
                    alt="Eror"
                    onClick={() => handleEdit(post.id)}
                  />
                </div>
                <img
                  src={post.img ? post.img : "./Default image.svg"}
                  alt="Eror"
                />
                <h1>{post.name}</h1>
                <p>{post.date}</p>
                <p>{post.map}</p>
              </div>
            ))
        ) : (
          <Loading />
        )}
      </div>
      <button className="px-[40px] py-[10px] border-2 rounded ms-[490px] mb-[100px] mt-[50px] hover:bg-slate-400 hover:text-black hover:border-slate-400">
        Carregar Mais
      </button>
    </div>
  );
}
