import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import backgroundVideo from '../../assets/backgroundVideo.mp4';
import { useAuth } from '../../context/AuthContext';

function AuthPage() {
  const { login, register, continueAsGuest } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    identifier: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const updateField = event => {
    setForm(currentForm => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setError('');

    try {
      if (isLogin) {
        login({
          identifier: form.identifier,
          password: form.password,
        });
        return;
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <main className="auth-page">
      <video className="auth-video" autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="auth-overlay" />

      <section className="auth-card" aria-label={isLogin ? 'Login' : 'Register'}>
        <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={isLogin ? 'is-active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'is-active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p>{isLogin ? 'Sign in to manage your orders.' : 'Join and save your order history.'}</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <Form.Group controlId="registerName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your name"
              />
            </Form.Group>
          )}

          {isLogin ? (
            <Form.Group controlId="loginIdentifier">
              <Form.Label>Email / Username</Form.Label>
              <Form.Control
                required
                name="identifier"
                value={form.identifier}
                onChange={updateField}
                placeholder="Email or username"
              />
            </Form.Group>
          ) : (
            <Form.Group controlId="registerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
              />
            </Form.Group>
          )}

          <Form.Group controlId="authPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Password"
              minLength={4}
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateField}
                placeholder="Confirm password"
                minLength={4}
              />
            </Form.Group>
          )}

          <Button type="submit" className="primary-action">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Form>

        {isLogin && (
          <button type="button" className="text-action">
            Forgot Password
          </button>
        )}
        <button type="button" className="guest-action" onClick={continueAsGuest}>
          Continue as Guest
        </button>
      </section>
    </main>
  );
}

export default AuthPage;
