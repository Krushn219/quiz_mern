import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Category from "./scenes/category";
import SubCategory from "./scenes/subcategory";
import NewCategory from "./scenes/category/newCategory";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import EditCategory from "./scenes/category/editCategory";
import EditQuestion from "./scenes/question/EditQuestion";
import QuestionForm from "./scenes/question/QuestionForm";
import AllQuestions from "./scenes/question";
import NewSubCategory from "./scenes/subcategory/newSubCategory";
import EditSubCategory from "./scenes/subcategory/editSubCategory";
import Login from "./components/Login";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const base_url = "http://localhost:8000/";

  // State to track whether the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is already logged in (e.g., using a token in local storage)
  useEffect(() => {
    // Replace this with your actual logic to check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* <Sidebar isSidebar={isSidebar} /> */}
          {isLoggedIn && <Sidebar isSidebar={isSidebar} setIsLoggedIn={setIsLoggedIn} />}
          <main className="content">
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            {/* {isLoggedIn && <Topbar setIsSidebar={setIsSidebar} />} */}

            <Routes>
              {/* Use conditional rendering */}
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Category base_url={base_url} />} />

                  <Route path="/new-category" element={<NewCategory base_url={base_url} />} />
                  <Route path="/edit-category/:categoryId" element={<EditCategory base_url={base_url} />} />

                  <Route path="/question" element={<AllQuestions base_url={base_url} />} />
                  <Route path="/new-question" element={<QuestionForm base_url={base_url} />} />
                  <Route path="/edit-question/:questionId" element={<EditQuestion base_url={base_url} />} />

                  <Route path="/subcategory" element={<SubCategory base_url={base_url} />} />
                  <Route path="/new-subcategory" element={<NewSubCategory base_url={base_url} />} />
                  <Route path="/edit-subcategory/:subcategoryId" element={<EditSubCategory base_url={base_url} />} />
                </>
              ) : (
                <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} base_url={base_url} />} />
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>


  );
}

export default App;

