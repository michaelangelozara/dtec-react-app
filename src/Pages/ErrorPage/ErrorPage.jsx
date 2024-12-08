import ErrorIcon from "../../assets/icons/ErrorIcon.svg";

function ErrorPage(prop) {
    return(<>
        <div className="w-full h-screen flex justify-center items-center flex-col">
            <img src={ErrorIcon} className="size-72" alt="" />
            <h1 className="text-4xl">{prop.errorMessage}</h1>
        </div>
    </>);
}

export default ErrorPage;