import * as React from "react";
import { Redirect } from "react-router-dom";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Auth } from "aws-amplify";
import AWS from "aws-sdk";

// import { StoreState } from '../types';
// import { bindActionCreators, Dispatch } from 'redux';
// import { login } from '../actions/auth';
// import { Button } from '../components/Button';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    // .email("Enter a valid email address")
    .required(),
  password: Yup.string()
});

class SignIn extends React.Component {
  render() {
    // const {
    //   auth: { currentUser, loading, error }
    // } = this.props;

    // // User is already signed in, redirect to Dashboard
    // if (currentUser) {
    //   return <Redirect to="/" />;
    // }
    // const Loading = () => {
    //   return <div>Loading...</div>;
    // };

    // if (loading) {
    //   return <Loading />;
    // }

    return (
      <div>
        <h1>Login Form</h1>
        {/* {error && <div>Error: {error}</div>} */}
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirm: ""
          }}
          onSubmit={(values: LoginFormValues) => {
            const { email, password } = values;
            console.log("Login Submit ", email, " Password ", password);
            // this.props.login({ email, password });
            Auth.signIn(email, password)
              .then(user => {
                console.log("User ", user);
              })
              .catch(err => {
                console.log("LOGIN FAIL ", err);
              });
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
        <button>Hellloo</button>
        <button
          onClick={(e: any) => {
            e.preventDefault();
            this.props.history.push("/signup");
          }}
          color="green"
        >
          Sign Up
        </button>
        <button
          onClick={async (e: any) => {
            // const session = await Auth.currentSession();
            // console.log("Session !", session);
            Auth.currentAuthenticatedUser()
              .then(user => console.log(user))
              .catch(err => console.log(err));

            Auth.currentSession()
              .then(sess => console.log("sess ", sess))
              .catch(err => console.log(err));
            Auth.currentUserCredentials()
              .then(sess => console.log("user cred ", sess))
              .catch(err => console.log(err));
            Auth.currentCredentials()
              .then(sess => console.log("cred ", sess))
              .catch(err => console.log(err));
            Auth.currentUserInfo()
              .then(sess => console.log("info ", sess))
              .catch(err => console.log(err));
          }}
          color="green"
        >
          Test Auth API
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
