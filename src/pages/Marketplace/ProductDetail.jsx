import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronLeft,
  Book,
  Home,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  Star,
  Sparkles,
  ShoppingCart,
  Download,
  BookOpen,
  Share2,
  Plus,
  Minus,
  X,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";
import {useNavigate, useParams} from "react-router-dom";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllMarketProducts, fetchProductById, downloadProductById} from "../../store/admin/market/productSlice";
import {toast} from "react-toastify";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const { id } = useParams();
  const navigate=useNavigate();
  useEffect(() => {
    dispatch(fetchProductById(id))
      .then((result) => {
        if (fetchProductById.fulfilled.match(result)) {
          const productData = result.payload;
          if (productData?.image_array && productData.image_array.length > 0) {
            const imageId = productData.image_array[0];
            return dispatch(downloadProductById(imageId));
          }
        }
      })
      .then((imageResult) => {
        if (imageResult && downloadProductById.fulfilled.match(imageResult)) {
          if (imageResult.payload.uploadDocURL) {
            setPreviewImageUrl(imageResult.payload.uploadDocURL);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching product or image:', error);
      });
    dispatch(fetchAllMarketProducts());
  }, [id]);
  const {product, products:relatedProducts} = useSelector((state)=> state.product)
  
  // Handle preview download
  const handlePreviewView = async () => {
    setLoading(true);
    if (!id || !product?.product_id) {
      toast.error('Product ID not found');
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(downloadProductById(product?.product_id)).unwrap();
      console.log(res);
      const fileUrl = res.uploadDocURL; // assuming this holds the file URL directly

      if (!fileUrl) {
        toast.error('No file URL found');
        setLoading(false);
        return;
      }

      setDocumentUrl(fileUrl);
      setShowPreviewModal(true);
      setLoading(false);
      // toast.success('Document loaded successfully!');
    } catch (err) {
      setLoading(false);
      console.error("Preview error:", err);
      toast.error('Something went wrong while loading the document');
    }
  };

  // Colors for dark mode
  const colors = {
    primary: "#bb86fc",
    secondary: "#3700b3",
    accent: "#03dac6",
    accentLight: "#018786",
    accentSecondary: "#cf6679",
    text: "#e0e0e0",
    lightText: "#ffffff",
    background: "#121212",
    cardBg: "#1e1e1e",
    cardBgAlt: "#2d2d2d",
    borderColor: "#333333",
    sidebarBg: "#1a1a1a",
    navActiveBg: "rgba(187, 134, 252, 0.12)",
    inputBg: "#2d2d2d",
  };

  // const product = {
  //   id: 1,
  //   title: "Advanced Algebra Workbook",
  //   author: "Dr. Smith",
  //   price: 250,
  //   type: "Workbook",
  //   subject: "Mathematics",
  //   class: "Grade 10",
  //   featured: true,
  //   rating: 4.8,
  //   ratings: 124,
  //   description:
  //     "A comprehensive workbook for advanced algebra concepts. Includes practice problems, step-by-step solutions, and chapter tests. Perfect for Grade 10 students looking to master algebraic concepts.",
  //   pages: 180,
  //   publishDate: "June 15, 2023",
  //   format: "PDF",
  //   fileSize: "12.4 MB",
  //   image: "algebra_cover.jpg",
  //   preview: ["preview1.jpg", "preview2.jpg", "preview3.jpg"],
  // };

  // const relatedProducts = [
  //   {
  //     id: 7,
  //     title: "Geometry Fundamentals",
  //     author: "Dr. Smith",
  //     price: 220,
  //     image: "geometry_cover.jpg",
  //   },
  //   {
  //     id: 8,
  //     title: "Trigonometry Made Easy",
  //     author: "Prof. Johnson",
  //     price: 280,
  //     image: "trigonometry_cover.jpg",
  //   },
  //   {
  //     id: 9,
  //     title: "Pre-Calculus Guide",
  //     author: "Dr. Davis",
  //     price: 300,
  //     image: "precalc_cover.jpg",
  //   },
  // ];
  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setDocumentUrl(null);
  }


  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - similar to marketplace component */}
        {/* <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        > */}
          {/* <div className="flex items-center">
            <a href="#" className="flex items-center mr-4">
              <ChevronLeft
                className="w-5 h-5 mr-1"
                style={{ color: colors.primary }}
              />
              <span style={{ color: colors.primary }}>Back to Marketplace</span>
            </a>
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Product Details
            </h2>
          </div> */}

          {/* <div className="flex items-center space-x-4"> */}
            {/* Cart button */}
            {/* <button
              className="p-2 rounded-full hover:bg-opacity-20 relative"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: colors.primary }}
              />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: colors.accent, color: "#000" }}
              >
                3
              </span>
            </button> */}

            {/* Other header buttons as in marketplace component */}
            {/* <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" style={{ color: colors.accent }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: colors.primary }} />
              )}
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20 relative"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Bell className="w-5 h-5" style={{ color: colors.primary }} />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accentSecondary }}
              ></span>
            </button>

            <div
              className="w-8 h-8 rounded overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #bb86fc 0%, #3700b3 100%)",
              }}
            ></div> */}
          {/* </div> */}
        {/* </header> */}

        {/* Product Detail Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Product Image */}
            <div className="col-span-1">
              <div
                className="rounded-lg overflow-hidden shadow-md mb-4"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div
                  className="h-72 bg-cover bg-center"
                  style={{
                    backgroundImage: previewImageUrl ? `url(${previewImageUrl})` : 'none',
                    backgroundColor: colors.cardBg,
                  }}
                />
              </div>

              {/* Preview thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {product?.preview?.map((img, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-md"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div
                      className="h-20 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${img})`,
                        backgroundColor: colors.cardBg,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column - Product Details */}
            <div className="col-span-1">
              <div
                className="rounded-lg shadow-md p-5 h-full"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h1
                  className="text-2xl font-medium mb-2"
                  style={{ color: colors.lightText }}
                >
                  {product?.title}
                </h1>

                <p
                  className="text-sm mb-3"
                  style={{ color: "rgba(224, 224, 224, 0.7)" }}
                >
                  by {product?.author || product?.description}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-3">
                    <Star
                      className="w-5 h-5 mr-1"
                      style={{ color: colors.accent }}
                    />
                    <span style={{ color: colors.text }}>{product?.rating??'-'}</span>
                  </div>
                  <span style={{ color: "rgba(224, 224, 224, 0.5)" }}>
                    ({product?.ratings??0} ratings)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: colors.navActiveBg,
                      color: colors.primary,
                    }}
                  >
                    {product?.subject}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: colors.navActiveBg,
                      color: colors.primary,
                    }}
                  >
                    {product?.class || product?.grade}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: colors.navActiveBg,
                      color: colors.primary,
                    }}
                  >
                    {product?.type||product?.content_type}
                  </span>
                </div>

                <p className="mb-6" style={{ color: colors.text }}>
                  {product?.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Pages
                    </p>
                    <p style={{ color: colors.text }}>{product?.pages??"-"}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Published
                    </p>
                    <p style={{ color: colors.text }}>{product?.publishDate || product?.createdAt.substr(0, 10)}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Format
                    </p>
                    <p style={{ color: colors.text }}>{product?.format??"-"}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      File Size
                    </p>
                    <p style={{ color: colors.text }}>{product?.fileSize??"-"}</p>
                  </div>
                </div>

                <button
                  className="w-full py-2 px-4 rounded-lg font-medium mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(3, 218, 198, 0.2)",
                    color: colors.accent,
                    border: `1px solid ${colors.accent}`,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onClick={handlePreviewView}
                  disabled={loading}
                >
                  <BookOpen className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Preview Sample'}
                </button>

                <button
                  className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(187, 134, 252, 0.2)",
                    color: colors.primary,
                    border: `1px solid ${colors.primary}`,
                  }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Right Column - Purchase Information */}
            <div className="col-span-1">
              <div
                className="rounded-lg shadow-md p-5 mb-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center">
                    <Sparkles
                      className="w-6 h-6 mr-2"
                      style={{ color: colors.accent }}
                    />
                    <span
                      className="text-2xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {product?.price}
                    </span>
                  </div>
                  <span style={{ color: "rgba(224, 224, 224, 0.7)" }}>
                    Sparks
                  </span>
                </div>

                {/* <div className="flex items-center justify-between mb-5">
                  <span style={{ color: colors.text }}>Quantity:</span>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 rounded-l-lg flex items-center justify-center"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderTop: `1px solid ${colors.borderColor}`,
                        borderLeft: `1px solid ${colors.borderColor}`,
                        borderBottom: `1px solid ${colors.borderColor}`,
                      }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div
                      className="w-10 h-8 flex items-center justify-center"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderTop: `1px solid ${colors.borderColor}`,
                        borderBottom: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      {quantity}
                    </div>
                    <button
                      className="w-8 h-8 rounded-r-lg flex items-center justify-center"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderTop: `1px solid ${colors.borderColor}`,
                        borderRight: `1px solid ${colors.borderColor}`,
                        borderBottom: `1px solid ${colors.borderColor}`,
                      }}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div> */}

                {/* <div
                  className="p-3 rounded-lg mb-5 flex items-center"
                  style={{
                    backgroundColor: colors.navActiveBg,
                  }}
                >
                  <span className="flex-1" style={{ color: colors.text }}>
                    Total:
                  </span>
                  <div className="flex items-center">
                    <Sparkles
                      className="w-4 h-4 mr-1"
                      style={{ color: colors.accent }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: colors.primary }}
                    >
                      {product?.price * quantity}
                    </span>
                  </div>
                </div> */}

                {/* <button
                  className="w-full py-3 rounded-lg font-medium mb-3"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#000",
                  }}
                >
                  Add to Cart
                </button> */}

                {/* <button
                  className="w-full py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: colors.accent,
                    color: "#000",
                  }}
                  onClick={()=> navigate('/market/cart')}
                >
                  Buy Now
                </button> */}
              </div>

              {/* Related Products */}
              <div
                className="rounded-lg shadow-md p-5"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="font-medium mb-4"
                  style={{ color: colors.primary }}
                >
                  Related Products
                </h3>

                <div className="space-y-4">
                  {relatedProducts?.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-2 rounded-lg hover:bg-opacity-50 cursor-pointer"
                      style={{
                        backgroundColor: colors.cardBg,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded bg-cover bg-center mr-3"
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundColor: colors.inputBg,
                        }}
                      />

                      <div className="flex-1">
                        <h4
                          className="text-sm font-medium"
                          style={{ color: colors.lightText }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                           {item.author || item.description}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Sparkles
                          className="w-3 h-3 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.primary }}
                        >
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Document Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="w-11/12 h-5/6 rounded-lg shadow-xl relative"
            style={{
              backgroundColor: colors.cardBgAlt,
              border: `1px solid ${colors.borderColor}`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center p-4 border-b"
              style={{ borderColor: colors.borderColor }}
            >
              <h3
                className="text-lg font-medium"
                style={{ color: colors.primary }}
              >
                Document Preview - {product?.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-opacity-50 cursor-pointer"
                style={{
                  backgroundColor: "rgba(187, 134, 252, 0.1)",
                  color: colors.primary,
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 h-full">
              {documentUrl ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full rounded-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                  title="Document Preview"
                />
              ) : (
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div className="text-center">
                    <BookOpen
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: colors.primary }}
                    />
                    <p style={{ color: colors.text }}>
                      Loading document...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
