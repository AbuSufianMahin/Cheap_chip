"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LinkAccountDialog() {
    const params = useSearchParams();
    const emailToLink = params.get("email");
    const provider = params.get("provider");
    const router = useRouter();
    const [openConsentDialogue, setOpenConsentDialogue] = useState(false);

    useEffect(() => {
        if (emailToLink) {
            setOpenConsentDialogue(true); // opens automatically on mount
        }
    }, [emailToLink]);


    const handleLinkingConsent = async (agreed, provider) => {
        if (agreed) {
            // update the provider array

            toast.info("Account linked successfully. You can now use either sign-in method.");
        }
        else {

            if (provider === "google") {
                router.replace("/home")
                toast.info("Account linking skipped. You can link it anytime later.");
            }
            else {
                // ask to login using password
            }

        }
    };
    return (
        <AlertDialog
            open={openConsentDialogue}
            onOpenChange={setOpenConsentDialogue}
        >
            <AlertDialogContent className="max-w-md w-full mx-auto px-4 py-6 md:px-6 md:py-8">
                <AlertDialogHeader className="space-y-3 text-center">
                    <AlertDialogTitle className="text-xl font-semibold text-center w-full">
                        Link your accounts?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-left text-sm sm:text-base leading-relaxed">
                        <strong>{emailToLink}</strong> is already connected with an account using a password.
                        <br />
                        Do you want to add <strong>{provider}</strong> as a sign-in option for this account?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction
                        className="flex-1"
                        onClick={() => handleLinkingConsent(true, provider)}
                    >
                        Yes
                    </AlertDialogAction>

                    <AlertDialogAction
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleLinkingConsent(false, provider)}
                    >
                        No
                    </AlertDialogAction>
                    {/* <AlertDialogAction
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleLinkingConsent(false, provider)}
                    >
                        Don't ask again!
                    </AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default LinkAccountDialog