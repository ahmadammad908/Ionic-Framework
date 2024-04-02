import React, { useState } from 'react';
import { IonContent, IonHeader } from '@ionic/react';
import { Timestamp, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../Server/Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

interface FormData {
  title: string;
  description: string;
  course: string;
  image: File | null;
  poster: File | null;
  video: File | null;

  createdAt: Date;
}

const Add = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    course: '',
    image: null,
    poster: null,
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

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedPoster = e.target.files[0];
      setFormData({ ...formData, poster: selectedPoster });
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
    if (!formData.title || !formData.description || !formData.course || !formData.image || !formData.poster || !formData.video) {
      toast.error('Please fill all the fields');
      return;
    }

    const imageStorageRef = ref(storage, `/images/${Date.now()}${formData.image.name}`);
    const videoStorageRef = ref(storage, `/videos/${Date.now()}${formData.video.name}`);
    const posterStorageRef = ref(storage, `/poster/${Date.now()}${formData.poster.name}`);

    const uploadImage = uploadBytesResumable(imageStorageRef, formData.image);
    const uploadVideo = uploadBytesResumable(videoStorageRef, formData.video);
    const uploadPoster = uploadBytesResumable(posterStorageRef, formData.poster);

    let imageDownloadUrl = '';
    let videoDownloadUrl = '';
    let posterDownloadUrl = '';

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

    const posterUploadTask = uploadPoster.on(
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
        getDownloadURL(uploadPoster.snapshot.ref).then((url) => {
          posterDownloadUrl = url;
          getDownloadURL(uploadVideo.snapshot.ref).then((url) => {
            videoDownloadUrl = url;

            // Once both image and video are uploaded, save data to Firestore
            getDownloadURL(uploadImage.snapshot.ref).then((url) => {
              imageDownloadUrl = url;

              const articleRef = collection(db, 'products');
              addDoc(articleRef, {
                title: formData.title,
                description: formData.description,
                course: formData.course,
                imageUrl: imageDownloadUrl,
                posterUrl: posterDownloadUrl,
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
        })
      }
    );

    // Clean up
    Promise.all([imageUploadTask, videoUploadTask, posterUploadTask]).then(() => {
      setFormData({
        title: '',
        description: '',
        course: '',
        image: null,
        poster: null,
        video: null,
        createdAt: Timestamp.now().toDate(),

      });
    });
  };

  return (
    <>
      <IonHeader>
        <BackButton />
      </IonHeader>
      <IonContent>
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ margin: '30px' }}>
          <div className="bg-white shadow-md rounded-md p-8 max-w-sm w-full m-[40px]">
            <>
              <h2 className="text-xl font-bold mb-6 text-center text-black">Upload <span className='text-blue-500'>Courses</span></h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                    What's Your Course title....
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 text-black font-bold"
                    placeholder="Course title..."
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Write Your Course Description....
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-black font-bold"
                    placeholder="Course Description..."
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Course Outline...
                  </label>
                  <input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-black font-bold"
                    placeholder="Course Headlines..."
                  />
                </div>
              

                <div>
                  <div className="col-span-full">
                    <label htmlFor="image" className="block text-sm font-bold leading-6 text-gray-900">
                      Upload Video Thumbnail....
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          {/* Add your video thumbnail upload icon SVG */}
                        </svg>
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="videoThumbnail"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload Video Thumbnail</span>
                            <input
                              type="file"
                              id="videoThumbnail"
                              onChange={handlePosterChange}
                              name="poster"
                              accept="image/*"
                              className="sr-only border-2 border-gray-500"
                            />
                          </label>
                        </div>
                        <span className="text-xs leading-5 text-gray-600 font-bold">PNG, JPG, GIF up to 10MB</span>
                        <span className="ml-2 text-sm text-gray-500" id="videoThumbnail-label font-bold">
                          {formData.poster && formData.poster.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="col-span-full">
                    <label htmlFor="image" className="block text-sm font-bold leading-6 text-gray-900">
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
                          {/* Add your image upload icon SVG */}
                        </svg>
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload Image</span>
                            <input
                              type="file"
                              id="image"
                              onChange={handleImageChange}
                              name="image"
                              accept="image/*"
                              className="sr-only border-2 border-gray-500"
                            />
                          </label>
                        </div>
                        <span className="text-xs leading-5 text-gray-600 font-bold">PNG, JPG, GIF up to 10MB</span>
                        <span className="ml-2 text-sm text-gray-500" id="image-label font-bold">
                          {formData.image && formData.image.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="video" className="block text-sm  leading-6 text-gray-900 font-bold">
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
                          <span>Upload Course Video</span>
                          <input
                            type="file"
                            id="video"
                            onChange={handleVideoChange}
                            name="video"
                            accept="video/*"
                            className="sr-only font-bold"
                          />
                        </label>
                      </div>
                      <span className="text-xs leading-5 text-gray-600 font-bold">MP4, MOV, AVI up to 100MB</span>
                      <span className="ml-2 text-sm text-gray-500" id="video-label font-bold">
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
                      <span className="text-sm font-bold text-gray-500">Loading ({progress}%)</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePublish}
                  className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
