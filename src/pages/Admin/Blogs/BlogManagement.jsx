import {useEffect, useState, useCallback, useMemo} from "react";
import {useTheme} from "../../../contexts/ThemeContext.jsx";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import BlogView from "./BlogView";
import {fetchBlogs, clearBlogState} from "../../../store/admin/blogSlice.js";
import {useDispatch, useSelector} from "react-redux";
import ScreenLoader from "../../../components/loader/ScreenLoader.jsx";
import Pagination from "../../../components/pagination/Pagination.jsx";

const BlogManagement = () => {
    const dispatch = useDispatch();
    const {blogs, loading} = useSelector((state) => state.blogs);
    const {colors} = useTheme();
    const [activeView, setActiveView] = useState("list");
    // const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const totalItems = blogs?.pagination?.total;

    // Use stable blog ID for key - only changes when actually switching blogs
    const blogFormKey = useMemo(() => selectedBlog?.id || 'new', [selectedBlog?.id]);
    useEffect(()=> {
        dispatch(fetchBlogs({page, limit}));

    } , [dispatch,page,limit]);
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > Math.ceil(totalItems / limit)) return;
        setPage(newPage);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // reset to first page when limit changes
    };
    // Function to load blogs from API
    const loadBlogs = useCallback(async () => {
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
    }, [dispatch]);

    // Function to handle view changes
    const handleViewChange = useCallback((view, blog = null) => {
        console.log(blog);
        // Clear blog state when navigating away from form to ensure fresh data on next edit
        if (activeView === 'form' && view !== 'form') {
            dispatch(clearBlogState());
        }
        setSelectedBlog(blog);
        setActiveView(view);
    }, [activeView, dispatch]);

    // Function to handle blog updates (refresh list after changes)
    const handleBlogUpdated = useCallback(() => {
        // void loadBlogs();
        // setActiveView("list");
    }, [loadBlogs]);

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
                {activeView === "list" && (
                    <BlogList
                        blogs={blogs}
                        isLoading={isLoading}
                        error={error}
                        onAddNew={() => handleViewChange("form")}
                        onViewBlog={(blog) => handleViewChange("view", blog)}
                        onEditBlog={(blog) => handleViewChange("form", blog)}
                        onRefresh={loadBlogs}
                    />)}

                {activeView === "list" && (
                    <div className={'mt-5'}>
                    <Pagination
                        page={page}
                        limit={limit}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    /></div>
                   )}
                {activeView === "form" && (<BlogForm
                        key={blogFormKey}
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
