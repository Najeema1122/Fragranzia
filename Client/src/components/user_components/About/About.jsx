import React from "react";
import img1 from "../../../assets/caucasian-woman-applying-perfume-her-neck.png"
import img2 from "../../../assets/img2@_about.png"
import './About.css'

const About = () => {

    return (
        <>
            <div className="about_container">
                <div className="about_section">
                    <h1>About Fragranzia</h1>

                    <div className="paragarph_section">
                        <p>At Fragranzia, we believe that a perfume is more than just a scent—it's a story,
                            an art, and a science combined to create memories that linger. Our journey began
                            with a vision to craft exquisite fragrances that capture the essence of individuality
                            and elevate every moment into something timeless.</p> <br />

                           <p> Guided by passion and precision, we source the finest ingredients from around the world
                            to create perfumes that resonate with authenticity and luxury. Each bottle is a masterpiece,
                            meticulously crafted to deliver an unparalleled sensory experience. </p><br />

                           <p> Our commitment goes beyond creating fragrances. We aim to inspire confidence, evoke emotions
                            , and celebrate uniqueness through every drop we produce. Fragranzia isn’t just a brand—it’s
                            a celebration of you, your style,
                            and your moments. </p><br />

                            <p>With a legacy built on quality, artistry, and innovation, we invite you to explore
                            our collection and find a scent that speaks your story.</p></div>
                </div>
                <div className="imageSection">
                    <img src={img1} alt="img1" />
                    <img src={img2} alt="img2" /></div>

            </div></>)
}
export default About;