"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";

import FormLabel from "../form/form-label";
import FormInput from "../form/form-input";
import CheckoutAction from "@/actions/checkout-action";

export default function CheckoutForm() {
  const [state, formAction] = useFormState(CheckoutAction, {});
  const formRef = useRef(null);

  function handleFormSubmit(event) {
    event.preventDefault();

    if (formRef.current) {
      formRef.current.submit();
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-10">Billing Details</h2>

      <form
        ref={formRef}
        id="checkout-form"
        className="space-y-6"
        action={formAction}
      >
        <div>
          <FormLabel>
            Full Name <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your full name"
            name="fullName"
          />
        </div>
        <div>
          <FormLabel>
            Delivery Address <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your delivery address"
            name="address"
          />
        </div>
        <div>
          <FormLabel>
            Town/City <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your town/city"
            name="city"
          />
        </div>
        <div>
          <FormLabel>
            Phone Number <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your phone number"
            name="phone"
            required={true}
          />
        </div>
        <div>
          <FormLabel>
            Email Address <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your email address"
            name="email"
            required={true}
          />
        </div>
      </form>

      <button
        className="bg-primary px-8 py-2 rounded-sm text-white mt-4 hover:bg-primary-dark"
        onClick={handleFormSubmit}
      >
        Save
      </button>
    </div>
  );
}
