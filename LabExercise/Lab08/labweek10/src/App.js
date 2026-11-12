import { useState } from 'react';
import './App.css';

const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
];

const initialForm = {
  email: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  postalCode: '',
  agreedToTerms: false,
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted({ ...form });
  }

  return (
    <main className="page">
      <section className="form-card" aria-labelledby="form-title">
        <div className="form-heading">          
          <h1 id="form-title">Data Entry Form</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                onChange={handleChange}
                required
                type="email"
                value={form.email}
              />
            </div>

            <div className="form-field ">
              <label htmlFor="name">Name</label>
              <input
                autoComplete="name"
                id="name"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                type="text"
                value={form.name}
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="address1">Address 1</label>
              <input
                autoComplete="address-line1"
                id="address1"
                name="address1"
                placeholder="1234 Main St"
                onChange={handleChange}
                required
                type="text"
                value={form.address1}
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="address2">Address 2</label>
              <input
                autoComplete="address-line2"
                id="address2"
                name="address2"
                placeholder="Apartment, studio, or floor"
                onChange={handleChange}
                type="text"
                value={form.address2}
              />
            </div>

            <div className="form-field">
              <label htmlFor="city">City</label>
              <input
                autoComplete="address-level2"
                id="city"
                name="city"
                onChange={handleChange}
                required
                type="text"
                value={form.city}
              />
            </div>

            <div className="form-field">
              <label htmlFor="province">Province</label>
              <select
                autoComplete="address-level1"
                id="province"
                name="province"
                onChange={handleChange}
                required
                value={form.province}
              >
                <option disabled value="">Select a province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="form-field full-width">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                autoComplete="postal-code"
                id="postalCode"
                name="postalCode"
                onChange={handleChange}
                required
                type="text"
                value={form.postalCode}
              />
            </div>
          </div>

          <label className="terms-field" htmlFor="agreedToTerms">
            <input
              checked={form.agreedToTerms}
              id="agreedToTerms"
              name="agreedToTerms"
              onChange={handleChange}
              required
              type="checkbox"
            />
            <span>I agree to the Terms and Conditions</span>
          </label>

          <button className="submit-button" type="submit">Submit</button>
        </form>

        {submitted && (
          <section className="submitted-details" aria-live="polite" aria-labelledby="submitted-title">
            <p className="eyebrow">SUBMISSION RECEIVED</p>
            <h2 id="submitted-title">Your information</h2>
            <dl>
              <div><dt>Email</dt><dd>{submitted.email}</dd></div>
              <div><dt>Name</dt><dd>{submitted.name}</dd></div>
              <div>
                <dt>Address</dt>
                <dd>
                  {[submitted.address2, submitted.address1]
                    .filter(Boolean)
                    .join(', ')}
                </dd>
              </div>
              <div><dt>City</dt><dd>{submitted.city}</dd></div>
              <div><dt>Province</dt><dd>{submitted.province}</dd></div>
              <div><dt>Postal Code</dt><dd>{submitted.postalCode}</dd></div>
              
            </dl>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
