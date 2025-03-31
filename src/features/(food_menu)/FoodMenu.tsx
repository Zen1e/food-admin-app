import { useEffect, useState } from "react";
import axios from "axios";
import CatFoodMenu from "./_components/CatFoodMenu";

export default function FoodMenu() {
  const [catList, setCatList] = useState();
  const [addCat, setAddCat] = useState(false);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/cat/");
        setCatList(response.data.cats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (addCat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addCat]);

  const handleCat = (e) => {
    setNewCat(e.target.value);
  };

  const createCategory = async () => {
    try {
      const response = await axios.post("http://localhost:3001/cat/", { catName: newCat },
        { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
      setAddCat(false);
      setCatList([...catList,{catName: newCat}]);
      console.log(response);
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[calc(100vw-205px)] bg-gray-100">
      {addCat && (
        <div className="w-full h-full ml-[-205px] fixed bg-black/25 flex justify-center items-center z-10">
          <div className="w-[500px] h-[300px] rounded-[5px] bg-white p-[25px]">
            <div className="w-full h-[50px] flex justify-between">
              <div className="text-[20px] font-bold">Add new category</div>
              <div
                className="p-[5px] w-fit h-fit bg-gray-100 rounded-full"
                onClick={() => setAddCat(false)}
              >
                <img src="./x.svg" className="w-[30px] h-[30px]" />
              </div>
            </div>
            <div className="flex flex-col gap-[10px] mt-[20px]">
              <div className="font-bold">Category name</div>
              <input
                type="text"
                placeholder="Add category..."
                className="w-full outline-none h-[40px] rounded-[5px] border p-[10px]"
                value={newCat}
                onChange={handleCat}
              />
            </div>
            <button
              className="ml-[320px] rounded-[5px] mt-[50px] bg-black text-white px-[15px] py-[10px]"
              onClick={createCategory}
            >
              Add category
            </button>
          </div>
        </div>
      )}
      <div className="w-full h-[60px] flex"></div>
      
      <div className="p-[24px] rounded-[12px] bg-white m-[30px] flex flex-col gap-[20px]">
        <div className="font-bold text-[25px]">Dishes category</div>
        <div className="flex gap-[15px] flex-wrap">
          <div className="border px-[20px] py-[5px] rounded-full bg-white">
            All dishes
          </div>
          {catList &&
            catList.map((el, index) => (
              <div
                className="border px-[20px] py-[5px] rounded-full bg-white"
                key={index}
              >
                {el.catName}
              </div>
            ))}
          <div
            className="w-[36px] h-[36px] rounded-full bg-red-500 text-white text-[22px] text-center"
            onClick={() => setAddCat(true)}
          >
            +
          </div>
        </div>
      </div>

      {catList?.map((element, index) => (
        <div key={index}>
          <CatFoodMenu category={element.catName} catList={catList}/>
        </div>
      ))}
    </div>
  );
}
