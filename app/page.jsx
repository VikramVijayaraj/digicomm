import { redirect } from "next/navigation";

import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCarousel from "@/components/banner/banner-carousel";
import Script from "next/script";
import ConvertKitForm from "./convertkit-form";
import EbookModal from "@/components/card/ebook-modal";

export default async function Home({ searchParams }) {
  const session = await auth();

  if (session?.user?.email) {
    const result = await getUserByEmail(session.user.email);

    if (result.length === 0) {
      redirect("/register");
    }
  }

  if (searchParams?.query) {
    return <FilteredProductsPage />;
  }

  return (
    <main className="space-y-8 lg:space-y-16">
      {/* <script src="https://f.convertkit.com/ckjs/ck.5.js" />
      <form
        action="https://app.kit.com/forms/8000363/subscriptions"
        class="seva-form formkit-form"
        method="post"
        data-sv-form="8000363"
        data-uid="406de69960"
        data-format="modal"
        data-version="5"
        data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":"10"},"powered_by":{"show":false,"url":"https://kit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"hide","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'
        min-width="400 500 600 700 800"
      >
        <div data-style="full">
          <div data-element="column" class="formkit-background"></div>
          <div data-element="column" class="formkit-column">
            <div class="formkit-header" data-element="header">
              <h2>Get our how to guide</h2>
            </div>
            <ul
              class="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            ></ul>
            <div data-element="fields" class="seva-fields formkit-fields">
              <div class="formkit-field">
                <input
                  class="formkit-input"
                  name="email_address"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  required=""
                  type="email"
                />
              </div>

              <button
                data-element="submit"
                class="formkit-submit formkit-submit"
              >
                <div class="formkit-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span class="">Send me the guide</span>
              </button>
            </div>
            <div class="formkit-disclaimer" data-element="disclaimer">
              We respect your privacy. Unsubscribe at anytime.
            </div>
          </div>
        </div>
      </form> */}

      {/* <ConvertKitForm /> */}
      <EbookModal loggedInUserEmail={session?.user?.email} />

      <Banner />
      {/* <BannerCarousel /> */}

      <Categories />
      <BestSelling />
      <Newsletter />
    </main>
  );
}
