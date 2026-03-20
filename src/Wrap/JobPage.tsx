import FooterPage from "../Component/footerPage";
import JobPage from "../HomePage/JobPage";
import Navbar from "../HomePage/Navbar";

const WrapJobPage=()=>{
    return (
        <div >
            <Navbar/>
            <JobPage/>
            <FooterPage/>
        </div>
    );
};

export default WrapJobPage;