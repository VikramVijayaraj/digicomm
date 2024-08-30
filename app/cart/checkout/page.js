import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";

export default function Checkout() {
  return (
    <div className="global-padding py-10">
      <h2 className="text-2xl font-semibold mb-10">Billing Details</h2>

      <form className="space-y-6">
        <div>
          <FormLabel>
            Full Name <span className="text-required">*</span>
          </FormLabel>
          <FormInput type="text" placeholder="Enter your full name" />
        </div>
        <div>
          <FormLabel>
            Delivery Address <span className="text-required">*</span>
          </FormLabel>
          <FormInput type="text" placeholder="Enter your delivery address" />
        </div>
        <div>
          <FormLabel>
            Town/City <span className="text-required">*</span>
          </FormLabel>
          <FormInput type="text" placeholder="Enter your town/city" />
        </div>
        <div>
          <FormLabel>
            Phone Number <span className="text-required">*</span>
          </FormLabel>
          <FormInput type="text" placeholder="Enter your phone number" />
        </div>
        <div>
          <FormLabel>
            Email Address <span className="text-required">*</span>
          </FormLabel>
          <FormInput type="text" placeholder="Enter your email address" />
        </div>
      </form>
    </div>
  );
}
