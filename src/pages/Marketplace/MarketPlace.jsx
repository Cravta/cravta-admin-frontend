import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Book,
  BookOpen,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  Filter,
  ChevronDown,
  Grid,
  List,
  Star,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";
import { useNavigate } from "react-router-dom";
import { fetchAllMarketProducts, fetchPreviewImages } from "../../store/admin/market/productSlice";
import { useDispatch, useSelector } from "react-redux";
import {useTheme} from "../../contexts/ThemeContext";
const Marketplace = () => {
  const navigate = useNavigate();
  // Colors for dark mode
  const {colors} = useTheme()
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    maxRating: null,
    subject: "",              // Subject ID
    grade: "",                // Grade
    contentType: "",          // Content type
    sortBy: "createdAt",      // Can be 'price' or 'rating'
    sortOrder: "desc",        // 'asc' or 'desc'
    page: 1,
    limit: 10,
    featured: "",             // true/false
    publishingStatus: "",     // e.g., 'published', 'draft'
    userType: "",             // 'teacher', 'admin'
  });
  const {products, previewImages} = useSelector((state)=> state.product)
  useEffect(() => {
    dispatch(fetchAllMarketProducts());
  },[])
  const handleSortChange = (e) => {
    const value = e.target.value;

    switch (value) {
      case "Featured":
        setFilters((prev) => ({
          ...prev,
          sortBy: "createdAt",
          sortOrder: "desc",
          featured: true,
        }));
        break;
      case "Price: Low to High":
        setFilters((prev) => ({
          ...prev,
          sortBy: "price",
          sortOrder: "asc",
          featured: "",
        }));
        break;
      case "Price: High to Low":
        setFilters((prev) => ({
          ...prev,
          sortBy: "price",
          sortOrder: "desc",
          featured: "",
        }));
        break;
      case "Rating":
        setFilters((prev) => ({
          ...prev,
          sortBy: "rating",
          sortOrder: "desc",
          featured: "",
        }));
        break;
      case "Newest":
      default:
        setFilters((prev) => ({
          ...prev,
          sortBy: "createdAt",
          sortOrder: "desc",
          featured: "",
        }));
        break;
    }
  };


  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const getImageUrl = (imageId) => {
    if (!imageId) return null;
    
    // Format the image ID to match the previewImages key format (e.g., "11" -> "image_11")
    const formattedImageId = `image_${imageId}`;
    // console.log('Formatted imageId:', formattedImageId);
    
    // If previewImages is available and has the image ID, use it
    if (previewImages && previewImages[formattedImageId]) {
      console.log(`Using preview image for ${formattedImageId}:`, previewImages[formattedImageId]);
      return previewImages[formattedImageId];
    }
    
    // Fallback to null if no preview image is available
    // console.log(`No preview image found for ${formattedImageId}`);
    return null;
  };

  useEffect(() => {
    setFilteredProducts(products || []);
    
    // Collect all image_array[0] values from products
    if (products && products.length > 0) {
      const imageIds = products
        .map(product => product.image_array && product.image_array[0])
        .filter(imageId => imageId && String(imageId).trim() !== '');
      
      // Remove duplicates
      const uniqueImageIds = [...new Set(imageIds)];
      
      console.log('Collected image IDs:', uniqueImageIds);
      
      // Fetch preview images if we have image IDs
      if (uniqueImageIds.length > 0) {
        dispatch(fetchPreviewImages(uniqueImageIds));
      }
    }
  }, [products, dispatch]);
  useEffect(() => {
    const queryParams = Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) =>
                value !== null &&
                value !== "" &&
                value !== undefined
        )
    );

    dispatch(fetchAllMarketProducts(queryParams));
  }, [filters]);
  // const products = [
  //   {
  //     id: 1,
  //     title: "Advanced Algebra Workbook",
  //     author: "Dr. Smith",
  //     price: 250,
  //     type: "Workbook",
  //     subject: "Mathematics",
  //     class: "Grade 10",
  //     featured: true,
  //     rating: 4.8,
  //     image: "algebra_cover.jpg",
  //   },
  //   {
  //     id: 2,
  //     title: "Chemistry Lab Experiments",
  //     author: "Prof. Johnson",
  //     price: 320,
  //     type: "Lab Manual",
  //     subject: "Chemistry",
  //     class: "Grade 11",
  //     featured: true,
  //     rating: 4.5,
  //     image: "chemistry_cover.jpg",
  //   },
  //   {
  //     id: 3,
  //     title: "World History: Modern Era",
  //     author: "Dr. Davis",
  //     price: 280,
  //     type: "Textbook",
  //     subject: "History",
  //     class: "Grade 9",
  //     featured: false,
  //     rating: 4.2,
  //     image: "history_cover.jpg",
  //   },
  //   {
  //     id: 4,
  //     title: "English Literature Analysis",
  //     author: "Sarah Williams",
  //     price: 190,
  //     type: "Study Guide",
  //     subject: "English",
  //     class: "Grade 12",
  //     featured: false,
  //     rating: 4.7,
  //     image: "english_cover.jpg",
  //   },
  //   {
  //     id: 5,
  //     title: "Physics Problem Solving",
  //     author: "Dr. Miller",
  //     price: 300,
  //     type: "Practice Book",
  //     subject: "Physics",
  //     class: "Grade 11",
  //     featured: false,
  //     rating: 4.6,
  //     image: "physics_cover.jpg",
  //   },
  //   {
  //     id: 6,
  //     title: "Biology Illustrated Guide",
  //     author: "Jennifer Adams",
  //     price: 350,
  //     type: "Reference",
  //     subject: "Biology",
  //     class: "Grade 10",
  //     featured: true,
  //     rating: 4.9,
  //     image: "biology_cover.jpg",
  //   },
  // ];

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Sidebar - same as your existing component */}
      {/* <div
        className="w-64 shadow-lg"
        style={{ backgroundColor: colors.sidebarBg }}
      >
        <div
          className="p-5 flex justify-center border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <div className="h-16">
            <img src={Logo1} alt="EduGame Logo" className="h-20 w-auto" />
          </div>
        </div> */}

        {/* User info and navigation - similar to your existing sidebar */}
        {/* <div className="p-5">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: colors.primary }}
            >
              JS
            </div>
            <div>
              <p className="font-medium" style={{ color: colors.primary }}>
                John Smith
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Teacher
              </p>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <Home
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded"
                  style={{
                    backgroundColor: colors.navActiveBg,
                    color: colors.primary,
                    fontWeight: 500,
                  }}
                >
                  <BookOpen
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <ShoppingCart
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  My Purchases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  My Classes
                </a>
              </li>
            </ul>
          </nav>
        </div> */}
      {/* </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        {/* <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        >
          <div className="flex items-center">
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Marketplace
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" style={{ width: "300px" }}>
              <input
                type="text"
                placeholder="Search for content..."
                className="w-full py-2 pl-10 pr-4 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              />
              <Search
                className="absolute left-3 top-2.5 w-5 h-5"
                style={{ color: "rgba(224, 224, 224, 0.5)" }}
              />
            </div>

            <button
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
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Settings className="w-5 h-5" style={{ color: colors.primary }} />
            </button>

            <button
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
            ></div>
          </div>
        </header> */}

        {/* Filter Bar */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center px-3 py-2 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter
                className="w-4 h-4 mr-2"
                style={{ color: colors.primary }}
              />
              <span>Filters</span>
              <ChevronDown
                className="w-4 h-4 ml-2"
                style={{ color: colors.primary }}
              />
            </button>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor:
                    viewMode === "grid" ? colors.navActiveBg : "transparent",
                  color: viewMode === "grid" ? colors.primary : colors.text,
                }}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor:
                    viewMode === "list" ? colors.navActiveBg : "transparent",
                  color: viewMode === "list" ? colors.primary : colors.text,
                }}
                onClick={() => setViewMode("list")}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span style={{ color: colors.text }}>Sort by:</span>
            <select
              className="py-2 px-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onChange={handleSortChange}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Expanded Filter Panel (conditionally rendered) */}
        {filterOpen && (
          <div
            className="p-4 grid grid-cols-5 gap-4"
            style={{
              backgroundColor: colors.cardBgAlt,
              borderTop: `1px solid ${colors.borderColor}`,
            }}
          >
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Subject
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
                onChange={(e) => updateFilter("subject", e.target.value)}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Class/Grade
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
                onChange={(e) => updateFilter("grade", e.target.value)}
              >
                <option value="">All Grades</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Content Type
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
                onChange={(e) => updateFilter("contentType", e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Textbook">Textbook</option>
                <option value="Workbook">Workbook</option>
                <option value="Study Guide">Study Guide</option>
                <option value="Practice Test">Practice Test</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Reference Material">Reference Material</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Price Range
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "under100") {
                      updateFilter("minPrice", 0);
                      updateFilter("maxPrice", 100);
                    } else if (value === "100-250") {
                      updateFilter("minPrice", 100);
                      updateFilter("maxPrice", 250);
                    } else if (value === "250-500") {
                      updateFilter("minPrice", 250);
                      updateFilter("maxPrice", 500);
                    } else if (value === "over500") {
                      updateFilter("minPrice", 500);
                      updateFilter("maxPrice", null);
                    } else {
                      updateFilter("minPrice", null);
                      updateFilter("maxPrice", null);
                    }
                  }}
              >
                <option value="">Any Price</option>
                <option value="under100">Under 100 Sparks</option>
                <option value="100-250">100–250 Sparks</option>
                <option value="250-500">250–500 Sparks</option>
                <option value="over500">Over 500 Sparks</option>
              </select>
            </div>

            {/* <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Author
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <option>All Authors</option>
                <option>Dr. Smith</option>
                <option>Prof. Johnson</option>
                <option>Dr. Davis</option>
                <option>Platform Content</option>
              </select>
            </div> */}
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          {/* Featured Section */}
          <div className="mb-8">
            <h3
              className="text-xl font-medium mb-4"
              style={{ color: colors.primary }}
            >
              Featured Content
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {products
                .filter((product) => product.featured)
                .map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/market/marketplace/product/${product.id}`)}
                    className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundColor: colors.cardBg,
                      }}
                    >
                      <div
                        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: colors.accent,
                          color: "#000",
                        }}
                      >
                        Featured
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          {product.title}
                        </h4>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span style={{ color: colors.primary }}>
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-sm mb-2"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        by {product.author}
                      </p>

                      <div className="flex items-center text-sm mb-3">
                        <Star
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.text }}>
                          {product.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.subject}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.class}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.type}
                        </span>
                      </div>

                      <button
                        className="w-full py-2 rounded-lg font-medium transition-colors duration-300"
                        style={{
                          backgroundColor: colors.primary,
                          color: "#000",
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              {filteredProducts.filter((product) => product.featured).length === 0 && (
                <div className="p-4 text-start">
                  <h4
                    className="font-medium mb-2"
                    style={{ color: colors.lightText }}
                  >
                    No Products Found
                  </h4>
                  {/* <p
                    className="text-sm"
                    style={{ color: "rgba(224, 224, 224, 0.7)" }}
                  >
                    We couldn't find any products matching your search criteria.
                  </p> */}
                </div>
              )}
            </div>
          </div>

          {/* All Products Section */}
          <div>
            <h3
              className="text-xl font-medium mb-4"
              style={{ color: colors.primary }}
            >
              All Content
            </h3>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                    onClick={() => navigate(`/market/marketplace/product/${product.id}`)}
                  >
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: product.image_array && product.image_array[0] 
                          ? `url(${getImageUrl(product.image_array[0]) || product.image})`
                          : `url(${product.image})`,
                        backgroundColor: colors.cardBg,
                      }}
                    />

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          {product.title}
                        </h4>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span style={{ color: colors.primary }}>
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-sm mb-2"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        by {product.author || product.description}
                      </p>

                      <div className="flex items-center text-sm mb-3">
                        <Star
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.text }}>
                          {product.rating??"-"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.subject}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.class || product.grade}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.content_type}
                        </span>
                      </div>

                      <button
                        className="w-full py-2 rounded-lg font-medium transition-colors duration-300"
                        style={{
                          backgroundColor: colors.primary,
                          color: "#000",
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        Product Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg overflow-hidden shadow-md flex"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div
                      className="w-48 bg-cover bg-center"
                      style={{
                        backgroundImage: product.image_array && product.image_array[0] 
                          ? `url(${getImageUrl(product.image_array[0]) || product.image})`
                          : `url(${product.image})`,
                        backgroundColor: colors.cardBg,
                      }}
                    />

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          {product.title}
                        </h4>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span style={{ color: colors.primary }}>
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-sm mb-2"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        by {product.author}
                      </p>

                      <div className="flex items-center text-sm mb-3">
                        <Star
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.text }}>
                          {product.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.subject}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.class}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: colors.navActiveBg,
                            color: colors.primary,
                          }}
                        >
                          {product.type}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <button
                          className="px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                          style={{
                            backgroundColor: colors.primary,
                            color: "#000",
                            border: `1px solid ${colors.primary}`,
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredProducts.length === 0 && ( 
                <div className="p-4 text-start">
                  <h4
                    className="font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    No Products Found
                  </h4>
                  {/* <p
                    className="text-sm"
                    style={{ color: "rgba(224, 224, 224, 0.7)" }}
                  >
                    We couldn't find any products matching your search criteria.
                  </p> */}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
