import { IonContent, IonHeader } from "@ionic/react"
import Privacybtn from "./Privacybtn"
const Privacy = () => {
  return (
    <>
      <IonContent >
        <IonHeader>
          <Privacybtn />
        </IonHeader>
        <IonContent fullscreen={true} className="ios overscroll content-ltr " style={{ "--offset-top": "44px", "--offset-bottom": "0px" }}>
          <div className="mt-[30px] justify-center flex">
            <p className="font-bold text-start " >Last updated: March 23,2024</p>
          </div>
          <div className="flex justify-center m-[20px]">
            <p className="font-bold text-center prose prose-lg mt-6 max-w-4xl leading-[30px] text-gray-500">
              This Privacy Policy describes the policies and procedures of Tech Sea regarding the collection, use, and disclosure of personal data when you use our website.  <a href="https://techsea.netlify.app" className="text-blue-500 underline">https://techsea.netlify.app</a>. We provide free courses designed to help you easily learn skills and prepare for your dream job.  By using the Service, you agree to the collection and use of information in accordance with this policy. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold m-[10px] text-center"  > Information Collection and Use</h1>
          </div>
          <div className="flex justify-center">
            <p className="font-bold text-center prose prose-lg mt-6 max-w-4xl leading-[30px] text-gray-500 m-[10px]">
              We collect several types of information for various purposes to provide and improve our Service to you.

              Personal Data: When you use our website, we may ask for certain personally identifiable information that can be used to contact or identify you. This may include your name, email address, phone number, and other similar information
            </p>
          </div>
          <div className="flex justify-center mt-[20px]">
            <h1 className="text-2xl font-bold "  > Personal Data</h1>
          </div>
          <div className="flex justify-center">
            <p className="font-bold text-center prose prose-lg mt-6 max-w-4xl leading-[30px] text-gray-500 m-[10px]">
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
              Email address
               First name and last name
               Phone number Cookies and Usage Data
               We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.

            </p>
          </div>

        </IonContent>
      </IonContent>


    </>
  )
}

export default Privacy