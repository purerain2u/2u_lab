export const safelyManipulateDOM = (id: string, callback: (element: HTMLElement) => void) => {
    const element = document.getElementById(id);
    if (element) {
      callback(element);
    }
  };
