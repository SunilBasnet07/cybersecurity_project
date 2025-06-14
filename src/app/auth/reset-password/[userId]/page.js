import ResetPassword from '@/components/ResetPassword'

const ResetPasswordWrapper = async({ params,searchParams }) => {

  const otp = searchParams.otp;
  const userId = (await params)?.userId;


  return <ResetPassword userId={userId} otp={otp} />
    
  
}

export default ResetPasswordWrapper
