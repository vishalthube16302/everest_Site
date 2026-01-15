/* eslint-disable @typescript-eslint/no-explicit-any */
export class LightningService {
  private static instance: Promise<void> | null = null;
  private static scriptLoaded = false;

  private static readonly SCRIPT_SRC = "https://fwseries3-dev-ed.develop.my.site.com/External/lightning/lightning.out.js";
  private static readonly ENDPOINT = "https://fwseries3-dev-ed.develop.my.site.com/External";
  private static readonly APP_NAME = "c:WebsiteInquiryApp";
  private static readonly AUTH_TOKEN = "";

  private static loadScript(): Promise<void> {
    if (this.scriptLoaded) return Promise.resolve();
    if (document.querySelector(`script[src="${this.SCRIPT_SRC}"]`)) {
      this.scriptLoaded = true;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.SCRIPT_SRC;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Lightning Out script'));
      document.body.appendChild(script);
    });
  }

  public static init(): Promise<void> {
    if (this.instance) return this.instance;

    this.instance = (async () => {
      try {
        await this.loadScript();
        
        return new Promise<void>((resolve, reject) => {
          if ((window as any).$Lightning) {
            (window as any).$Lightning.use(
              this.APP_NAME,
              () => {
                console.log("Lightning App initialized successfully");
                resolve();
              },
              this.ENDPOINT,
              this.AUTH_TOKEN
            );
          } else {
            reject(new Error("Lightning Out library not found"));
          }
        });
      } catch (error) {
        console.error("Failed to initialize Lightning App:", error);
        this.instance = null; // Allow retrying if it failed
        throw error;
      }
    })();

    return this.instance;
  }

  public static createComponent(componentName: string, targetId: string): Promise<any> {
    return this.init().then(() => {
      return new Promise((resolve) => {
        (window as any).$Lightning.createComponent(
          componentName,
          {},
          targetId,
          (cmp: any) => {
            console.log(`${componentName} created successfully`);
            resolve(cmp);
          }
        );
      });
    });
  }
}
