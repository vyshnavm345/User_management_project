import Navbar from 'components/Navbar';
import { Helmet } from 'react-helmet';

const Layout = ({title, content, children}) =>{
    return(
        <>
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={content} />
    </Helmet>
    <Navbar />
    <div className="container mt-5">
        {children}
    </div>
    </>
    )
    
}

export default Layout