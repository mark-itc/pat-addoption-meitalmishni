import { Button } from '../components/home/Button';
import { Header } from '../components/home/Header';
import { Text } from '../components/home/Text';
import { Link } from '../components/home/Link';
import { ModalBox } from '../components/home/ModalBox';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';
import AWS from 'aws-sdk';
import { getUserDetails } from '../Helpers/api';


function Home() {

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        region: 'me-central-1'
    });
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: 'kate-stone-matheson-uy5t-CJuIK4-unsplash.jpg',
        Expires: 60 * 60
    };

    const image = s3.getSignedUrl('getObject', params);

    const { authApiKey, setAuthApiKey, userId } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleLogin = () => {
        setShowModal(true);
        setModalType("Login");
    }

    const handleSignup = () => {
        setShowModal(true);
        setModalType("Signup");
    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    async function getUserDetailsHelper() {
        const result = await getUserDetails(userId, authApiKey);
        console.log("result api", result);

        if (!result.success) {
            console.log("Error", result.data);
        }
        else {

            if (typeof result.data == 'object') {
                setFirstName(result.data.userObject.first_name);
                setLastName(result.data.userObject.last_name);
                console.log(result);
            }
            else {
                alert(result.data);
            }
        }
    }


    useEffect(() => {
        getUserDetailsHelper();
    }, [authApiKey]);

    return (
        <>
            <div className="top-content">
                <div className="top-content-left">
                    <img src={image} className="home-image" alt="My Image" />
                </div>
                <div className="top-content-right">
                    <div>
                        {
                            !authApiKey ?
                                <>
                                    <Button text="Login" onClick={handleLogin} />
                                    <Button text="Signup" onClick={handleSignup} />
                                </>
                                :
                                <p>Wellcome {firstName} {lastName}</p>
                        }

                    </div>
                    <div className="search">
                        <h2>Welcome and say hi to your new friend</h2>
                        {
                            authApiKey ? <Link text="" /> : null
                        }

                    </div>

                </div>
            </div>
            <div className="bottom-content">
                <Header text="" />
                <div>
                    <Text text="" />
                </div>
            </div>

            {
                showModal ? <ModalBox visibility={showModal} type={modalType} handleModalClose={handleModalClose} /> : null
            }
        </>
    )
}

export default Home;