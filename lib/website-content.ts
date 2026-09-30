import { AboutPage, HomePage } from "@/types/website-content";
import { http, ValidationError } from "./http";

// Home Page Actions
type HomeResponse =
  | { success: true; message: string }
  | {
      success: false;
      errors?: Partial<Record<keyof HomePage, string>>;
    };

export async function postHomeAction(data: HomePage): Promise<HomeResponse> {
  try {
    const { data: responseData } = await http.put<{ message: string }>(
      "/api/v1/admin/pages/home",
      data,
    );
    return { success: true, message: responseData.message };
  } catch (error) {
    console.error("Error posting home action:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof HomePage, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// About Page Actions
type AboutResponse =
  | { success: true; message: string }
  | {
      success: false;
      errors?: Partial<Record<keyof AboutPage, string>>;
    };

export async function postAboutAction(data: AboutPage): Promise<AboutResponse> {
  try {
    const { data: responseData } = await http.put<{ message: string }>(
      "/api/v1/admin/pages/about",
      data,
    );
    return { success: true, message: responseData.message };
  } catch (error) {
    console.error("Error posting about action:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof AboutPage, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}
