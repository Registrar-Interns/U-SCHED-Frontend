import { useRef, useEffect } from "react";
import { CloseIcon } from "../../../icons";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  headerText?: string; // New optional prop
  headerImage?: string; // New optional prop
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  headerText,
  headerImage,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-1xl bg-white dark:bg-gray-900";

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-20 overflow-y-auto modal z-99999">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[2px]"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses} ${className} max-h-[80vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section with Background Image */}
        {headerText && (
          <div
            className="relative w-full text-center p-6 text-white font-semibold text-2xl rounded-t-1xl"
            style={{
              backgroundImage: headerImage ? `url(${headerImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {headerText}
          </div>
        )}

        {showCloseButton && (
         <button
          onClick={onClose}
          className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        )}

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
