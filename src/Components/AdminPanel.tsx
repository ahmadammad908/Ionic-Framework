import React, { useState } from 'react';
import { IonContent } from '@ionic/react';
import { Timestamp, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../Server/Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

// Assuming Example is a component
// import Navbar from './Navbar';

interface FormData {
  title: string;
  description: string;
  image: File | null;
  video: File | null;
  createdAt: Date;
}

const Add = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    video: null,
    createdAt: Timestamp.now().toDate(),
  });
  const [progress, setProgress] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setFormData({ ...formData, image: selectedImage });
    }
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedVideo = e.target.files[0];
      setFormData({ ...formData, video: selectedVideo });
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image || !formData.video) {
      toast.error('Please fill all the fields');
      return;
    }

    const imageStorageRef = ref(storage, `/images/${Date.now()}${formData.image.name}`);
    const videoStorageRef = ref(storage, `/videos/${Date.now()}${formData.video.name}`);

    const uploadImage = uploadBytesResumable(imageStorageRef, formData.image);
    const uploadVideo = uploadBytesResumable(videoStorageRef, formData.video);

    let imageDownloadUrl = '';
    let videoDownloadUrl = '';

    const imageUploadTask = uploadImage.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      }
    );

    const videoUploadTask = uploadVideo.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadVideo.snapshot.ref).then((url) => {
          videoDownloadUrl = url;

          // Once both image and video are uploaded, save data to Firestore
          getDownloadURL(uploadImage.snapshot.ref).then((url) => {
            imageDownloadUrl = url;

            const articleRef = collection(db, 'products');
            addDoc(articleRef, {
              title: formData.title,
              description: formData.description,
              imageUrl: imageDownloadUrl,
              videoUrl: videoDownloadUrl,
              createdAt: formData.createdAt,
              likes: [],
              comments: [],
            })
              .then(() => {
                toast.success('Article added successfully');
                setProgress(0);
                navigate('/');
              })
              .catch(() => {
                toast.error('Error adding article');
              });
          });
        });
      }
    );

    // Clean up
    Promise.all([imageUploadTask, videoUploadTask]).then(() => {
      setFormData({
        title: '',
        description: '',
        image: null,
        video: null,
        createdAt: Timestamp.now().toDate(),
      });
    });
  };

  return (
    <>

      {/* <IonHeader>
        <Navbar />
      </IonHeader> */}
      <IonContent>
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ margin: '30px' }}>
          <div className="bg-white shadow-md rounded-md p-8 max-w-sm w-full">

            <>
              <h2 className="text-xl font-bold mb-6 text-center">Create an article</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    placeholder="Enter your title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Subtitle
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    placeholder="Subtitle"
                  ></input>
                </div>
                <div>
                  <div className="col-span-full">
                    <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                      Upload Image
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Select File</span>
                            <input
                              type="file"
                              id="image"
                              onChange={handleImageChange}
                              name="image"
                              accept="image/*"
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <span className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</span>
                        <span className="ml-2 text-sm text-gray-500" id="image-label">
                          {formData.image && formData.image.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="video" className="block text-sm font-medium leading-6 text-gray-900">
                    Upload Video
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {/* Add your video upload icon SVG */}
                      </svg>
                      <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="video"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Select File</span>
                          <input
                            type="file"
                            id="video"
                            onChange={handleVideoChange}
                            name="video"
                            accept="video/*"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <span className="text-xs leading-5 text-gray-600">MP4, MOV, AVI up to 100MB</span>
                      <span className="ml-2 text-sm text-gray-500" id="video-label">
                        {formData.video && formData.video.name}
                      </span>
                    </div>
                  </div>
                </div>


                {progress > 0 && (
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      ></div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-500">Loading ({progress}%)</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePublish}
                  className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Publish
                </button>
              </div>
            </>

          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>

      </IonContent>

    </>
  );
};

export default Add;
