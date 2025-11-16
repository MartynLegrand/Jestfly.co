
export const isWebGLAvailable = () => {
  console.log("Checking WebGL availability");
  if (typeof window === 'undefined') {
    console.log("Window is undefined - server side rendering");
    return false;
  }
  
  try {
    const canvas = document.createElement('canvas');
    const hasWebGL = !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
    console.log("WebGL availability:", hasWebGL);
    return hasWebGL;
  } catch (e) {
    console.error("WebGL detection failed:", e);
    return false;
  }
};
