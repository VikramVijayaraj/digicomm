"use client";

import { useFormState } from "react-dom";

import FormLabel from "../form/form-label";
import FormInput from "../form/form-input";
import FormButton from "../form/form-button";
import UserDetailsAction from "@/actions/user-details-action";

export default function UserDetails({ data }) {
  const [state, formAction] = useFormState(UserDetailsAction, {});

  // const formRef = useRef(null);

  // function handleFormSubmit(event) {
  //   event.preventDefault();

  //   if (formRef.current) {
  //     formRef.current.submit();
  //   }
  // }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-10 text-center">
        Personal Details
      </h2>

      <form
        // ref={formRef}
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
            name="full-name"
            defaultValue={data && data.first_name + " " + data.last_name}
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
            defaultValue={data && data.phone}
          />
        </div>
        <div>
          <FormLabel>
            Address Line 1 <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your delivery address line 1"
            name="address-line1"
            required={true}
            defaultValue={data && data.address_line1}
          />
        </div>
        <div>
          <FormLabel>Address Line 2</FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your delivery address line 2"
            name="address-line2"
            defaultValue={data && data.address_line2}
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
            defaultValue={data && data.city}
          />
        </div>
        <div>
          <FormLabel>
            State <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your state"
            name="state"
            required={true}
            defaultValue={data && data.state}
          />
        </div>
        <div>
          <FormLabel>
            Country <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="text"
            placeholder="Enter your country"
            name="country"
            required={true}
            defaultValue={data && data.country}
          />
        </div>
        <div>
          <FormLabel>
            Zip Code <span className="text-required">*</span>
          </FormLabel>
          <FormInput
            type="number"
            placeholder="Enter your zip code"
            name="zip-code"
            required={true}
            defaultValue={data && data.zip_code}
          />
        </div>

        <FormButton
          type="submit"
          className="bg-primary px-8 py-2 rounded-sm text-white mt-4 hover:bg-primary-dark"
          // onClick={handleFormSubmit}
        >
          Save
        </FormButton>
      </form>
    </div>
  );
}
