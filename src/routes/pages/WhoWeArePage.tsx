import '@/app/[locale]/who-we-are/WhoWeArePage.css';

export function WhoWeArePage() {
  return (
    <div className="who-we-are-page">
      <div className="who-we-are-container">
        <h1 className="who-we-are-title">Who We Are</h1>

        <div className="who-we-are-hero">
          <img src="/images/who-we-are/hero.jpg" alt="Who We Are" />
        </div>

        <div className="who-we-are-content">
          <section className="who-we-are-section">
            <h2>Our Mission</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Massa turpis ullamcorper eget elementum feugiat sit quam dolor.
              Mauris in convallis interdum facilisis platea sapien. Scelerisque porttitor iaculis in mauris elementum eu vulputate.
            </p>
          </section>

          <section className="who-we-are-section">
            <h2>Our Vision</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Pellentesque viverra adipiscing vel dignissim elementum sed.
              Cum nec morbi posuere in hendrerit semper a ac massa. Blandit enim eu mauris lacus accumsan.
            </p>
          </section>

          <section className="who-we-are-section">
            <h2>Our Team</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Leo morbi tincidunt integer consectetur nam eget vel gravida sem.
              Consectetur blandit suspendisse dui nulla ut purus sit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
