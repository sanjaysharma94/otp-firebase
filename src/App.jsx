

import app from "./firebaseConfig";
import { getAuth, RecaptchaVerifier , signInWithPhoneNumber} from "firebase/auth"
import { useState } from "react";

export default function App() {
  const [phone, setPhone] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [user, setUser] = useState({});
  const [otpSent, setOtpSent] = useState(false);

  const handlechange = (e) => {
    setPhone(e.target.value);

  };
  const handlechange1 = (e) => {
    setUserOtp(e.target.value);

  };


  const auth  = getAuth(app);

 

  const captchaVerifier = () =>{

    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    const appVerifier = window.recaptchaVerifier

    signin(appVerifier) 

  }

  const signin = (appVerifier)=>{
    
    signInWithPhoneNumber(auth, `+91${phone}`, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setOtpSent(true)
     
      }).catch((error) => {
        console.log("otp not sent", error.message)
      })

}


  const sendOtp = () => {
    if (phone.length !== 10) {
      alert("Enter a valid phone number");
      return;
    }
    captchaVerifier()
  }

   const confirmOtp = ()=>{
    window.confirmationResult.confirm(userOtp).then((result) => {
      alert("user signed successfully")
      console.log(result.user)
      setUser(result.user);
      document.getElementById('recaptcha-container').innerHTML = ""
    }).catch((error) => {
      alert("otp does not match")
      document.getElementById('recaptcha-container').innerHTML = ""
        })

      }

      console.log(user)

  

  return (
    <div className="App">
      <div id='recaptcha-container'></div>
      <h1>Sign in</h1>
      
      <div>
      <input
        placeholder="Enter your mobile number"
        value={phone}
        onChange={handlechange}
      />
      <button onClick={sendOtp}>Send OTP</button>
      </div>

     { otpSent && <div>
      <input
        placeholder="Enter your otp"
        onChange={handlechange1}
      />
      <button onClick={confirmOtp}>Verify Otp</button>
      </div>}
    </div>
  );
}
