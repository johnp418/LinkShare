import * as React from "react";
import { Redirect } from "react-router-dom";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";

// import { StoreState } from '../types';
// import { bindActionCreators, Dispatch } from 'redux';
// import { login } from '../actions/auth';
// import { Button } from '../components/Button';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required(),
  password: Yup.string()
});

class SignIn extends React.Component {
  render() {
    const {
      auth: { currentUser, loading, error }
    } = this.props;

    // User is already signed in, redirect to Dashboard
    if (currentUser) {
      return <Redirect to="/" />;
    }
    const Loading = () => {
      return <div>Loading...</div>;
    };

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <h1>Login Form</h1>
        {error && <div>Error: {error}</div>}
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirm: ""
          }}
          onSubmit={(values: LoginFormValues) => {
            const { email, password } = values;
            console.log("Login Submit");
            this.props.login({ email, password });
          }}
          validationSchema={loginValidationSchema}
          render={(formikBag: FormikProps<LoginFormValues>) => {
            return (
              <Form>
                <Field
                  name="email"
                  render={(formikProps: FieldProps<LoginFormValues>) => {
                    const { field, form } = formikProps;
                    return (
                      <div>
                        <label htmlFor="">Email</label>
                        <input type="text" {...field} placeholder="Email" />
                        {form.touched.email &&
                          form.errors.email &&
                          form.errors.email}
                      </div>
                    );
                  }}
                />
                <Field
                  name="password"
                  render={({ field, form }: FieldProps<LoginFormValues>) => {
                    return (
                      <div>
                        <label htmlFor="">Password</label>
                        <input
                          type="password"
                          {...field}
                          placeholder="Password"
                        />
                        {form.touched.password &&
                          form.errors.password &&
                          form.errors.password}
                      </div>
                    );
                  }}
                />

                <button type="submit">Sign In</button>
              </Form>
            );
          }}
        />
        <button
          onClick={(e: any) => {
            e.preventDefault();
            this.props.history.push("/signup");
          }}
          color="green"
        >
          Sign Up
        </button>
      </div>
    );
  }
}

export default SignIn;
// const mapStateToProps = (state: StoreState) => ({
//   auth: state.auth
// });
// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return bindActionCreators({ login }, dispatch);
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Login);
