import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { client } from "../client";
import Confettis from "../components/Confettis";
import Spinner from "../components/Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [loading, setLoading] = useState(false);

  // Data of uploaded pin
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate(); // Navigate to a new page
  const showToastMessage = () => {
    toast.success('📷 Image uploaded successfully', {
        position: toast.POSITION.BOTTOM_CENTER
    });
  };
  const showUploadToast = () => {
    toast.success('📌 Pin created successfully, wait for ~10 seconds to see it', {
        position: toast.POSITION.BOTTOM_CENTER
    });
  };

  const uploadImage = uploadImages(
    setWrongImageType,
    setLoading,
    setImageAsset,
    showToastMessage
  );

  const savePin = savePins(
    title,
    about,
    destination,
    imageAsset,
    category,
    user,
    showUploadToast,
    navigate,
    setFields
  );
  return (
    <div className="mt-5 flex flex-col items-center justify-center lg:h-4/5">
      {/* When some field is empty */}
      {fields && (
        <p className="mb-5 text-xl text-red-500 transition-all duration-150 ease-in ">
          Please add all fields.
        </p>
      )}
      <div className=" flex w-full flex-col items-center justify-center bg-red-100 p-3 lg:w-4/5 lg:flex-row  lg:p-5">
        <div className="flex w-full flex-0.7 p-3">
          <div className=" flex h-420 w-full flex-col items-center justify-center border-2 border-dotted border-gray-300 p-3">
            {/* Image Loading */}
            {loading && <Spinner />}
            {/* IF wrong image type */}
            {wrongImageType && <p>It&apos;s wrong file type.</p>}
            {/* Adding Image */}
            {!imageAsset ? (
              //  {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
              <label htmlFor="file" className="cursor-pointer">
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  id="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="h-0 w-0"
                />
              </label>
            ) : (
              // Image Preview (Already uploaded)
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-red-100 p-3 text-xl outline-none transition-all duration-500 ease-in-out hover:shadow-md"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Writing Title */}

        <div className="mt-5 flex w-full flex-1 flex-col gap-6 lg:pl-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Set title
            placeholder="Add your title"
            className="border-b-2 border-gray-200 p-2 text-2xl font-bold outline-none sm:text-3xl"
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                savePin();
              }
            }}
          />

          {/* Writing About */}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="border-b-2 border-gray-200 p-2 text-base outline-none sm:text-lg"
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                savePin();
              }
            }}
          />
          {/* Writing destination */}
          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add destination URL"
            className="border-b-2 border-gray-200 p-2 text-base outline-none sm:text-lg"
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                savePin();
              }
            }}
          />

          {/* Selecting Category */}
          <div className="flex flex-col">
            <div>
              <p className="text:lg mb-2 font-semibold sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="w-4/5 cursor-pointer rounded-md border-b-2 border-gray-300 bg-red-100 p-2 text-base outline-none"
              >
                <option
                  value="others"
                  className="sm:text-bg border-b-2 border-gray-300 bg-red-100"
                >
                  Select Category
                </option>
                {categories.map((item) => (
                  <option
                    className="border-0 border-b-2 border-gray-300 bg-red-100 text-base capitalize text-black outline-none "
                    value={item.name}
                    key={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex items-end justify-end gap-3">
              {/* Cancel button */}
              <button
                type="button"
                onClick={savePin}
                className="w-28 rounded-full bg-red-500 p-2 font-bold text-white outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

function uploadImages(setWrongImageType, setLoading, setImageAsset , showToastMessage) {
  return (e) => {
    const file = e.target.files[0];
    // uploading asset to sanity
    if (
      file.type === "image/png" ||
      file.type === "image/svg" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/gif" ||
      file.type === "image/tiff" ||
      file.type === "image/webp"
    ) {
      setWrongImageType(false); // If image type is correct
      setLoading(true);
      client.assets // Upload image to sanity
        .upload("image", file, {
          contentType: file.type,
          filename: file.name,
        })
        .then((document) => {
          // After upload the got document
          setImageAsset(document);
          showToastMessage();

          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };
}

// TODO - sanitizing form data react

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export default CreatePin;