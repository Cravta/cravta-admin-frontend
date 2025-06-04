import { useDispatch, useSelector } from "react-redux";
import { clearPdfUrl } from "../../store/admin/contentSlice.js";


const ContentViewModal = () => {
  const {pdfUrl} = useSelector((state) => state.adminContent);
  const dispatch = useDispatch();

  if (!pdfUrl) return null;

  return (
    <>
    {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => dispatch(clearPdfUrl())}
            >
              ✖
            </button>
            <iframe
              src={pdfUrl}
              width="600"
              height="500"
              className="rounded-md shadow"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentViewModal;
