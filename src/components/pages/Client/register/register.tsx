import { Button, CircularProgress, createStyles, makeStyles, TextField } from "@material-ui/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormInputs, RegisterFormInputs, RegisterSchema } from "../../../../shares/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import './register.scss'
import { registerUser } from "../../../../core/apis/userService";
import { Link, useNavigate } from "react-router-dom";
import { TranslateService } from "../../../../core/services/translateService";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

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

function Register(){
  const [ passwordStatus, setPasswordStatus] = useState<boolean>(false)
  const classes = useStyles();
  const [ confirmPasswordStatus, setConfirmPasswordStatus] = useState<boolean>(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [ loading, setLoading ] = useState<boolean>(true)
  const navigate = useNavigate();
  const { translates } = useContext(TranslateService);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(RegisterSchema),
  })
  
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log('Form hop le: ', data);
    const { email, password } = data;
    const result = await registerUser({ email, password } as RegisterFormInputs);
    if(result){
      setSnackbar({ open: true, message: "Đăng ký thành công", severity: "success" });
      navigate('/login')
    }
    else{
      setSnackbar({ open: true, message: "Đăng ký thất bại", severity: "success" });
    }
  }

  useEffect(() => {
      const timeOut = setTimeout(() => {
        setLoading(false)
      }, 2000);
      return () => clearTimeout(timeOut);
    },[])

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
          <TextField {...register('email')} error={!!errors.email} helperText={errors.email?.message} label={'Email'} variant="outlined"/>
          <div className="password">
            <TextField type={ passwordStatus ? 'text' : 'password'} {...register('password')} error={!!errors.password} helperText={errors.password?.message} label='Password' variant="outlined"/>
            <div className="icon" onClick={() => setPasswordStatus(!passwordStatus)}>
              {passwordStatus ? <FaRegEye /> : <FaEyeSlash />}
            </div>
          </div>
          <div className="confirmPassword">
            <TextField type={ confirmPasswordStatus ? 'text' : 'password'} {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} 
            label='ConfirmPassword' variant="outlined"/>
            <div className="icon" onClick={() => setConfirmPasswordStatus(!confirmPasswordStatus)}>
              {confirmPasswordStatus ? <FaRegEye /> : <FaEyeSlash />}
            </div>
          </div>
          <div className="btn">
            <Button type="submit">Register</Button>
          </div>
        </form>
            </div>
                <div className="container__title">
                  <h1>{translates.welcome_back}</h1>
                  <p>{translates.please_login_to_use_all_features}</p>
                  <Link to="/register">
                    <Button className="hiddent" id="register">
                      {translates.login}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
    </>
  )
}

export default Register;
