import Footer from "../../components/footer";
import  zone  from "../../assets/zone.png";
import  userIcon  from "../../assets/user-icon.png";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (<>
    <div className="flex h-16 w-full max-w-full bg-blue-400 justify-between p-3 ">
        <img src={zone.src} className="h-8 mt-2 pl-3" alt="logo" />
        <img src={userIcon.src} className="h-8  mt-2 pr-8" alt="user-logo" />
    </div>
    {children}
        <Footer />
    </>

    )

}