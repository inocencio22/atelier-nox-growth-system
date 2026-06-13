// Type declaration for Behold Instagram widget custom element
import "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    "feed-id"?: string;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "behold-widget": HTMLElement;
  }
}
