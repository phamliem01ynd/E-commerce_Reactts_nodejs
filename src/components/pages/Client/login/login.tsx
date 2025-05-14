import { Button, CircularProgress, createStyles, makeStyles, Snackbar, TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormInputs, LoginSchema } from "../../../../shares/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "./login.scss"
import { login } from "../../../../core/apis/userService";
import { AuthService } from "../../../../core/services/authService";
import { Link, useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { TranslateService } from "../../../../core/services/translateService";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }),
);

function Login() {
  const [passwordStatus, setPasswordStatus] = useState(false);
  const classes = useStyles();
  const { setAuth } = useContext(AuthService);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState<boolean>(true)

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log('du lieu hop le: ',data);
    
    const result = await login(data);
    const resData = result.data;
    if (resData && resData.EC === 0) {
      localStorage.setItem("access_token", resData.access_token);
      setAuth({
        isAuthenticated: true,
        user: {
          id: resData?.user?.id ?? "",
          email: resData?.user?.email ?? "",
          name: resData?.user?.name ?? "",
          phone: resData?.user?.phone ?? "",
        },
      })

      setSnackbar({ open: true, message: "Đăng nhập thành công", severity: "success" });

      navigate("/");
    } else {
      setSnackbar({ open: true, message: "Đăng nhập thất bại", severity: "error" });
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false)
    }, 2000);
    return () => clearTimeout(timeOut);
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const { translates } = useContext(TranslateService);

  return (  
    <>
    { loading ? (<div className={`${classes.root} loading`}>
      <CircularProgress color="secondary" />
      <p>Đang tải</p>
    </div>) : (
            <div className="login">
              <div className="container">
                <div className="container__form">
                  <h1>{translates.login}</h1>
                  <div className="social-icon">
                    <FaFacebook className="icon" />
                    <FaGoogle className="icon" />
                    <FaGithub className="icon" />
                    <FaLinkedin className="icon" />
                  </div>
                  <p>{translates.use_email_to_login}</p>      
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          variant="outlined"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          label={"Email"}
        />
        <div className="password">
          <TextField
            type={passwordStatus ? "text" : "password"}
            label={"Password"}
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <div onClick={() => setPasswordStatus(!passwordStatus)} className="icon">
            {passwordStatus ? <FaRegEye /> : <FaEyeSlash />}
          </div>
        </div>
        <div className="btn">
          <Button type="submit" className=".btn">{translates.login}</Button>
        </div>
      </form>
      </div>
          <div className="container__title">
            <h1>{translates.welcome_back}</h1>
            <p>{translates.please_login_to_use_all_features}</p>
            <Link to="/register">
              <Button className="hiddent" id="register">
                {translates.register}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )}
    </>
    
  );
}

export default Login;