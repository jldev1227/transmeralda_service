import { useEffect, useState } from "react";

const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // En dispositivos móviles, cuando aparece el teclado, la altura del viewport se reduce
      const isMobile = window.innerWidth <= 768;

      if (isMobile && window.visualViewport) {
        // Verificar que window.visualViewport.height no sea undefined
        const visualHeight = window.visualViewport.height;

        if (typeof visualHeight === "number") {
          const heightDifference = window.screen.height - visualHeight;

          setKeyboardVisible(heightDifference > 150); // threshold de 150px para detectar teclado
        }
      } else if (isMobile) {
        // Fallback usando window.innerHeight
        const heightDifference = window.screen.height - window.innerHeight;

        setKeyboardVisible(heightDifference > 150);
      }
    };

    // Usar visualViewport si está disponible (mejor soporte)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      // También escuchar el evento 'scroll' para casos edge
      window.visualViewport.addEventListener("scroll", handleResize);
    } else {
      // Fallback para navegadores sin soporte
      window.addEventListener("resize", handleResize);
    }

    // Ejecutar una vez al montar para establecer el estado inicial
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return isKeyboardVisible;
};

export default useKeyboardVisible;
