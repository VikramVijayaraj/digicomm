"use client";

import { useState } from "react";
import ReactStars from "react-rating-stars-component";

// import avatar from "/images/avatar.png";

const allReviews = [
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
  {
    name: "Vikram",
    email: "vikram@email.com",
    rating: "4",
    review: "Nice product!",
  },
];

function ProductReview() {
  const [userReview, setUserReview] = useState({
    name: "",
    email: "",
    rating: "",
    review: "",
    // productId: productId,
  });
  // const [allReviews, setAllReviews] = useState([]);

  const ratingChanged = (newRating) => {
    setUserReview((prevValues) => {
      return {
        ...prevValues,
        rating: newRating,
      };
    });
  };

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUserReview((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  }

  async function handleSubmit() {
    console.log("Submitted!");
  }

  return (
    <div>
      <hr />

      <div className="py-6 flex flex-col-reverse lg:flex-row justify-around lg:space-x-20">
        {/* Reviews */}
        <div className="w-full h-[500px] overflow-auto">
          <h4 className="text-lg font-semibold mb-4">Reviews</h4>
          <hr />
          <div>
            {allReviews.length !== 0 ? (
              <ul className="py-4 overflow-auto">
                {allReviews &&
                  allReviews.map((review) => (
                    <li key={review._id} className="flex justify-between mb-6">
                      <div className="flex gap-5">
                        <img
                          className="h-12 rounded-full"
                          src="/images/avatar.png"
                        />
                        <div>
                          <p className="mb-5">{review.name}</p>
                          {/* <p className="text-sm">{review.email}</p> */}
                          <p>{review.review}</p>
                        </div>
                      </div>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={14}
                        activeColor="#FDA256"
                        edit={false}
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Add Review */}
        <div className="space-y-3 w-full mb-8 lg:mb-0">
          <h4 className="text-lg font-semibold">Add a review</h4>
          <p className="text-gray-500 text-xs">
            Required fields are marked <span className="text-red-500">*</span>
          </p>

          {/* Rating */}
          <div className="flex gap-2">
            <p className="uppercase text-sm">
              Your rating <span className="text-red-500">*</span>
            </p>
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={14}
              activeColor="#FDA256"
            />
          </div>

          <form>
            <div className="flex justify-between gap-3">
              <input
                onChange={handleInputChange}
                className="w-full p-2 border-2 border-gray-100"
                type="text"
                placeholder="Name *"
                name="name"
                value={userReview.name}
                required
              />
              <input
                onChange={handleInputChange}
                className="w-full p-2 border-2 border-gray-100"
                type="text"
                placeholder="Email *"
                name="email"
                value={userReview.email}
                required
              />
            </div>
            <textarea
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-100 my-4"
              type="text"
              name="review"
              placeholder="Your review"
              rows="5"
              value={userReview.review}
            />
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-primary text-white p-2 rounded-sm hover:bg-primary-dark lg:px-6 lg:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !userReview.name || !userReview.email || !userReview.rating
              }
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
