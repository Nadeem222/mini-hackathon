"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "./firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

const HomePage = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser){
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));

        if (!userDoc.exists()) {
  
          const registrationData = localStorage.getItem("registrationData");
          const {
            firstName = "",
            lastName = "",
            gender = "",
          } = registrationData ? JSON.parse(registrationData) : {};
  
          await setDoc(doc(firestore, "users", currentUser.uid), {
            firstName,
            lastName,
            gender,
            email: user.email
          });
          localStorage.removeItem("registrationData")
        }
        setUser(user);
        router.push("/dashboard")
      }
      else{

        setUser(null);
        router.push("/login")
      }
      setLoading(false)
    });

    return()=> unsubscribe();
  }, [router]);

  if(loading){
    return <p>Loading...</p>
  }
  return(
    <div>
      {user ? "Redirecting to dashboard..." : "Redirecting to login..." }
    </div>
  )
}

export default HomePage;