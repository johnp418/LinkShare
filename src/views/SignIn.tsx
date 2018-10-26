import * as React from "react";
import { Redirect } from "react-router-dom";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Auth } from "aws-amplify";
import { Dispatch, bindActionCreators } from "redux";
import { AppState, CurrentUser, APIProps } from "src/types";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  createLoadingSelector,
  createErrorMessageSelector
} from "src/reducers/selectors";
import { SET_CURRENT_USER, login } from "src/actions/user";

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

interface LoginFormValues {
  email: string;
  password: string;
}

interface Props {
  currentUser: CurrentUser;
  dispatch: Dispatch;
  redirectTo: (url: string) => void;
}

class SignIn extends React.Component<Props & APIProps> {
  render() {
    const { currentUser, loading, error, dispatch } = this.props;
    // dispatch(login("a", "b"))
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

            Auth.signIn(email, password)
              .then(data => {
                console.log("User Sign in ", data);
              })
              .catch(err => {
                console.log("Error Sign in ", err);
              });
            // this.props.login({ email, password });
            // Auth.signIn(email, password)
            //   .then(user => {
            //     console.log("User ", user);
            //   })
            //   .catch(err => {
            //     console.log("LOGIN FAIL ", err);
            //   });
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

            this.props.redirectTo("/auth/signup");
            // this.props.history.push("/signup");
          }}
          color="green"
        >
          Sign Up
        </button>
        <button
          onClick={async (e: any) => {
            Auth.currentAuthenticatedUser()
              .then(user => console.log("currentAuthenticatedUser ", user))
              .catch(err => console.log("currentAuthenticatedUser err", err));
            Auth.currentSession()
              .then(sess => console.log("currentSession ", sess))
              .catch(err => console.log("currentSession err", err));
            // Auth.currentUserCredentials()
            //   .then(sess => console.log("currentUserCredentials ", sess))
            //   .catch(err => console.log("currentUserCredentials err", err));
            // Auth.currentCredentials()
            //   .then(sess => console.log("currentCredentials ", sess))
            //   .catch(err => console.log("currentCredentials err", err));
            Auth.currentUserInfo()
              .then(sess => console.log("currentUserInfo ", sess))
              .catch(err => console.log("currentUserInfo error", err));
          }}
          color="green"
        >
          Test Auth API
        </button>
        <button
          onClick={async () => {
            Auth.signOut()
              .then(success => {
                console.log("Sign out success ? ", success);
              })
              .catch(err => {
                console.log("Error Sign out ", err);
              });
          }}
        >
          Sign out
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  loading: createLoadingSelector([SET_CURRENT_USER])(state),
  error: createErrorMessageSelector([SET_CURRENT_USER])(state),
  currentUser: state.currentUser
});
// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return bindActionCreators(
//     {
//       redirectTo: url => {
//         dispatch(push(url));
//       }
//     },
//     dispatch
//   );
// };
export default connect(
  mapStateToProps,
  null
  // mapDispatchToProps
)(SignIn);
