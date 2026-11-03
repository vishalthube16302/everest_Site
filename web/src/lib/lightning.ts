// The existing Salesforce Lightning Out form. Same app and endpoint as the live site.
const SCRIPT_SRC = "https://fwseries3-dev-ed.develop.my.site.com/External/lightning/lightning.out.js";
const ENDPOINT = "https://fwseries3-dev-ed.develop.my.site.com/External";
const APP_NAME = "c:WebsiteInquiryApp";
const COMPONENT = "c:websiteInquiryForm";

type Lightning = {
  use: (app: string, done: () => void, endpoint: string, token: string) => void;
  createComponent: (name: string, attrs: object, target: string, done: () => void) => void;
};

declare global {
  interface Window {
    $Lightning?: Lightning;
  }
}

let ready: Promise<void> | null = null;

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.$Lightning) return resolve();
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the enquiry form"));
    document.body.appendChild(script);
  });
}

function init() {
  ready ??= loadScript()
    .then(
      () =>
        new Promise<void>((resolve, reject) => {
          if (!window.$Lightning) return reject(new Error("Enquiry form library not found"));
          window.$Lightning.use(APP_NAME, resolve, ENDPOINT, "");
        }),
    )
    .catch((error) => {
      ready = null; // Allow a retry on the next visit to the form.
      throw error;
    });
  return ready;
}

export async function mountEnquiryForm(targetId: string) {
  await init();
  await new Promise<void>((resolve) => window.$Lightning!.createComponent(COMPONENT, {}, targetId, resolve));
}
