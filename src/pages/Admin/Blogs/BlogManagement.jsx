import {useEffect, useState} from "react";
import {useTheme} from "../../../contexts/ThemeContext.jsx";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import BlogView from "./BlogView";
import {fetchBlogs} from "../../../store/admin/blogSlice.js";
import {useDispatch, useSelector} from "react-redux";
import ScreenLoader from "../../../components/loader/ScreenLoader.jsx";

const BlogManagement = () => {
    const dispatch = useDispatch();
    const {blogs, loading} = useSelector((state) => state.blogs);
    const {colors} = useTheme();
    const [activeView, setActiveView] = useState("list");
    // const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        dispatch(fetchBlogs({}));
    }, [dispatch]);

    // Function to load blogs from API
    const loadBlogs = async () => {
        setIsLoading(true);
        try {
            await dispatch(fetchBlogs({}));
            console.log("Fetching in loadblogs")
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
            setError("Failed to load blogs. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle view changes
    const handleViewChange = (view, blog = null) => {
        console.log(blog);
        setSelectedBlog(blog);
        setActiveView(view);
    };

    // Function to handle blog updates (refresh list after changes)
    const handleBlogUpdated = () => {
        void loadBlogs();
        setActiveView("list");
    };

    return (<>
            {loading ? (<ScreenLoader/>) : <div className="p-6 overflow-auto">

                <div className="mb-6">
                    <h2
                        className="text-xl font-medium mb-2"
                        style={{color: colors.primary}}
                    >
                        Blog Management
                    </h2>
                    <p className="text-sm" style={{color: colors.textMuted}}>
                        Create, edit, and manage blog content across the platform
                    </p>
                </div>

                {/* Display the appropriate view based on state */}
                {activeView === "list" && (<BlogList
                        blogs={blogs}
                        isLoading={isLoading}
                        error={error}
                        onAddNew={() => handleViewChange("form")}
                        onViewBlog={(blog) => handleViewChange("view", blog)}
                        onEditBlog={(blog) => handleViewChange("form", blog)}
                        onRefresh={loadBlogs}
                    />)}

                {activeView === "form" && (<BlogForm
                        blog={selectedBlog}
                        onCancel={() => handleViewChange("list")}
                        onSaved={handleBlogUpdated}
                    />)}

                {activeView === "view" && (<BlogView
                        blog={selectedBlog}
                        onBack={() => handleViewChange("list")}
                        onEdit={(blog) => handleViewChange("form", blog)}
                    />)}
            </div>}
        </>);
};

export default BlogManagement;
