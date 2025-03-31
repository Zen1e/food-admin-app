import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Pencil } from "lucide-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ToastContainer, toast } from 'react-toastify';

export default function CatFoodMenu(props) {
  const { category, catList } = props;
  const [foods, setFoods] = useState([]);
  const [addFood, setAddFood] = useState(false);
  const [imgPath, setImgPath] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingreds, setIngreds] = useState("");
  const [picFile, setPicFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState({});
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/food/${category}`,
          { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
        setFoods(res.data.foods);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFoods();
  }, []);

  const handleName = (e) => {
    setFoodName(e.target.value);
  };
  const handlePrice = (e) => {
    setFoodPrice(e.target.value);
  };
  const handleIngr = (e) => {
    setIngreds(e.target.value);
  };

  const pictureFunc = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicFile(file);
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);
      setImgPath(imageUrl);
    }
  };

  const addDish = async () => {
    if (!foodName || !foodPrice || !ingreds || !picFile) {
      alert("Fill all forms");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", picFile);
    formData.append("upload_preset", "food_images");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtptrpft2/image/upload",
        formData
      );
      try {
        await axios.post("http://localhost:3001/food/", {
          foodName: foodName,
          category: category,
          ingredients: ingreds,
          price: foodPrice,
          image: response.data.secure_url,
        },
        { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
        window.location.reload();
      } catch (err) {
        console.log("Could not send data", err);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsLoading(false);
    setAddFood(false);
  };

  useEffect(() => {
    if (addFood) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addFood]);

  useEffect(() => {
    if (Object.keys(editing).length) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [editing]);

  const handleEdit = (id) => {
    const dish = foods.filter((el) => el._id === id);
    setEditing(dish[0]);
  };

  const deleteDish = async (id) => {
    console.log(id);
    try {
      await axios.delete("http://localhost:3001/food/", {
        data: { id: id }
      });
      setEditing({});
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-[24px] rounded-[12px] bg-white m-[30px] flex flex-col gap-[20px]">
      <ToastContainer />
      {addFood && (
        <div className="w-screen h-screen bg-black/75 fixed top-0 left-0 flex justify-center items-center z-10">
          <div className="w-[460px] p-[24px] rounded-[12px] bg-white h-fit flex flex-col gap-[24px]">
            {isLoading ? (
              <div className="w-full">
                <div className="p-[20px]">Adding dish...</div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <div className="font-bold text-[20px] flex items-center">
                    Add a new Dish to {category}
                  </div>
                  <div
                    className="p-[5px] w-fit h-fit bg-gray-100 rounded-full"
                    onClick={() => setAddFood(false)}
                  >
                    <img src="./x.svg" className="w-[30px] h-[30px]" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-[8px]">
                    <div className="ml-[5px]">Food name</div>
                    <input
                      type="text"
                      className="border outline-none h-[35px] rounded-[8px] p-[10px]"
                      placeholder="Enter a name..."
                      onChange={handleName}
                      value={foodName}
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <div className="ml-[5px]">Food price</div>
                    <input
                      type="number"
                      className="border outline-none h-[35px] rounded-[8px] p-[10px]"
                      placeholder="Enter a price..."
                      onChange={handlePrice}
                      value={foodPrice}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div>Ingredients</div>
                  <textarea
                    className="outline-none border rounded-[10px] resize-none px-[10px] py-[5px] h-[100px]"
                    placeholder="Ingredients..."
                    onChange={handleIngr}
                    value={ingreds}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div>Food image</div>
                  <div className="overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full h-[200px] border opacity-0"
                      onChange={pictureFunc}
                    />
                    <div className="w-[412px] h-[200px] mt-[-200px] border rounded-[10px] flex justify-center items-center">
                      {imgPath ? (
                        <img src={imgPath} />
                      ) : (
                        <div className="flex flex-col items-center gap-[10px]">
                          <Image />
                          <div>Choose a file or drag & drop it here</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex mt-[30px] justify-end">
                  <button
                    className="w-[100px] h-[35px] rounded-[7px] bg-black text-white"
                    onClick={addDish}
                  >
                    Add Dish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {Object.keys(editing).length > 0 && (
        <div className="w-screen h-screen fixed bg-black/10 top-0 left-0 z-10 flex justify-center items-center">
          <div className="w-[500px] h-fit bg-white rounded-[20px] flex flex-col p-[20px]">
            <div className="flex justify-between">
              <div className="text-[22px] font-bold mb-[30px]">Edit dish</div>
              <div
                className="p-[5px] w-fit h-fit bg-gray-100 rounded-full"
                onClick={() => setEditing({})}
              >
                <img src="./x.svg" className="w-[30px] h-[30px]" />
              </div>
            </div>
            <Formik
              initialValues={{
                foodName: editing.foodName,
                price: editing.price,
                category: editing.category,
                ingredients: editing.ingredients,
                image: editing.image,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.foodName) {
                  errors.foodName = "Required";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const formData = new FormData();
                formData.append("file", preview);
                formData.append("upload_preset", "food_images");
                try {
                  const res =
                    preview &&
                    (await axios.post(
                      "https://api.cloudinary.com/v1_1/dtptrpft2/image/upload",
                      formData
                    ));

                    console.log(res)

                  await axios.put("http://localhost:3001/food/", {
                    id: editing._id,
                    foodName: values.foodName,
                    price: values.price,
                    category: values.category,
                    ingredients: values.ingredients,
                    image: res ? res?.data?.secure_url : values.image,
                  },
                  { headers: { Authorization: `Bearer ${window.localStorage.authToken}` } });
                  window.location.reload();
                } catch (err) {
                  console.log(err);
                  toast.error("Edit failed");
                }
              }}
            >
              {/* {({ isSubmitting }) => ( */}
              <Form className="flex flex-col gap-[20px]">
                <div className="flex w-full">
                  <div className="w-[200px] text-[14px] text-gray-500">
                    Dish name
                  </div>
                  <Field
                    type="text"
                    name="foodName"
                    className="w-full border rounded-[5px] h-[36px] text-[17px] p-[7px] outline-none"
                    placeholder="Name..."
                  />
                  <ErrorMessage
                    name="foodName"
                    component="div"
                    className="absolute ml-[385px] mt-[5px] text-red-400"
                  />
                </div>
                <div className="flex w-full">
                  <div className="w-[200px] text-[14px] text-gray-500">
                    Dish category
                  </div>
                  <Field
                    name="category"
                    as="select"
                    className="w-full font-bold border rounded-[5px] h-[36px] text-[15px] p-[7px] outline-none"
                  >
                    {catList.map((el, index) => (
                      <option key={index}>{el.catName}</option>
                    ))}
                  </Field>
                </div>
                <div className="flex w-full">
                  <div className="w-[200px] text-[14px] text-gray-500">
                    Ingredients
                  </div>
                  <Field
                    type="text"
                    as="textarea"
                    name="ingredients"
                    className="resize-none w-full border rounded-[5px] h-fit text-[15px] p-[7px] outline-none"
                  />
                  <ErrorMessage name="ingredients" component="div" />
                </div>
                <div className="flex w-full">
                  <div className="w-[200px] text-[14px] text-gray-500">
                    Price
                  </div>
                  <Field
                    type="number"
                    name="price"
                    className="w-full border rounded-[5px] h-[36px] text-[17px] p-[7px] outline-none"
                    placeholder="Price..."
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="absolute ml-[385px] mt-[5px] text-red-400"
                  />
                </div>
                <div className="flex w-full">
                  <div className="w-[200px] text-[14px] text-gray-500">
                    Image
                  </div>
                  <div className="w-full h-[150px] border rounded-[5px] flex">
                    <img
                      src={
                        preview ? URL.createObjectURL(preview) : editing.image
                      }
                      className="w-full h-full object-cover z-10"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      className="w-full bg-black/10 h-[150px] border rounded-[5px] ml-[-319px] opacity-0 z-20"
                      onChange={(e) => setPreview(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end gap-[20px]">
                  <button
                    type="button"
                    className="w-[30%] border rounded-[10px]"
                    onClick={() => deleteDish(editing._id)}
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="w-[40%] border rounded-[10px] py-[10px] bg-black text-white"
                  >
                    Edit
                  </button>
                </div>
              </Form>
              {/* )} */}
            </Formik>
          </div>
        </div>
      )}
      <div className="font-bold text-[25px]">{category}</div>
      <div className="flex gap-[25px] flex-wrap">
        <div
          className="w-[270px] h-[240px] rounded-[15px] border border-red-400 border-dashed flex flex-col gap-[20px] justify-center items-center"
          onClick={() => setAddFood(true)}
        >
          <div className="w-[36px] h-[36px] rounded-full bg-red-500 text-white text-[22px] text-center">
            +
          </div>
          <div className="w-[180px] text-overflow text-center">
            Add a new dish to {category}
          </div>
        </div>
        {foods?.map((el, ind) => (
          <div key={ind} className="w-[270px] h-[240px] rounded-[15px] border">
            <div className="p-[10px] absolute bg-gray-300/30 rounded-full mt-[82px] ml-[210px] cursor-pointer">
              <Pencil
                className="text-red-500"
                onClick={() => handleEdit(el._id)}
              />
            </div>
            <div className="w-[90%] h-[50%] m-[5%] overflow-hidden rounded-[5px]">
              <img
                src={el.image}
                className="w-full h-full aspect-square object-cover"
              />
            </div>
            <div className="w-[90%] m-[5%] h-[35%] flex flex-col gap-[8px]">
              <div className="flex justify-between">
                <div className="text-red-600 font-bold text-[20px]">
                  {el.foodName}
                </div>
                <div className="text-[18px]">${el.price}</div>
              </div>
              <div className="line-clamp-2">{el.ingredients}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
