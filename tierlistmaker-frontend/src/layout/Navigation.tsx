import {BadgePlus, CircleUser, LogIn, LogOut, Menu, MessageCircleQuestion, Settings, User} from "lucide-react";
import Texts from "@/text/Texts";
import {SheetContent, SheetTrigger, Sheet} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Icon from "@/assets/icon.png";
import {
    CommandDialog, CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator,
} from "@/components/ui/command"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Paths, {PathUtils} from "@/Paths";
import LiteTierlist from "@/types/LiteTierlist";
import AuthenticationService from "@/services/AuthenticationService";

import SupportModalController from "@/features/support-modal/SupportModalController";
import SupportModal from "@/features/support-modal/SupportModal";
import CustomButton from "@/components/custom/Button";
import CreateTemplateSheet from "@/features/create-template/CreateTemplateSheet";
import SignInSheet from "@/features/sign-in/SignInSheet";

interface NavigationProps {
    searchTierlists: LiteTierlist[]
    initDone: boolean
}

export default function ({searchTierlists}: NavigationProps) {

    const [open, setOpen] = useState(false)

    const [showSheet, setShowSheet] = useState(false)
    const [showSupportModal, setShowSupportModal] = useState(false)
    const [showCreateTemplateSheet, setShowCreateTemplateSheet] = useState<boolean>(false)
    const [showSignInSheet, setShowSignInSheet] = useState<boolean>(false)

    const navigate = useNavigate()

    const supportModalController = new SupportModalController({
        states: {
            showState: {val: showSupportModal, set: setShowSupportModal}
        }
    })


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    return <div>

        {
            showSignInSheet && <SignInSheet showState={{val: showSignInSheet, set: setShowSignInSheet}}/>
        }


        {showSupportModal && <SupportModal controller={supportModalController}/>}

        {showCreateTemplateSheet &&
            <CreateTemplateSheet showState={{val: showCreateTemplateSheet, set: setShowCreateTemplateSheet}}/>}

        <header
            className="sticky top-0 flex h-16 items-center gap-4 border-b border-b-gray-100 py-3 px-4 md:px-6 max-w-screen-lg m-auto">
            <nav
                className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <CustomButton onClick={() => navigate(Paths.HOME)}
                              variant="text"
                              className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <img src={Icon} alt="Tierlistmaker.org Icon" className="h-10 w-10"/>
                    <span className="font-bold text-2xl text-gray-800 tracking-wider">{Texts.TIERLISTMAKER}</span>
                </CustomButton>


            </nav>
            <Sheet open={showSheet} onOpenChange={setShowSheet}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <CustomButton onClick={() => navigate(Paths.HOME)}
                                      variant="text"
                                      className="flex items-center gap-2 text-lg font-semibold md:text-base"
                        >
                            <img src={Icon} alt="Tierlistmaker.org Icon" className="h-10 w-10"/>
                            <span className="font-bold text-2xl text-gray-800 tracking-wider">{Texts.TIERLISTMAKER}</span>
                        </CustomButton>

                        <a
                            onClick={() => {
                                navigate(Paths.HOME)
                                setShowSheet(false)
                            }
                            }
                            className="text-foreground transition-colors hover:text-foreground cursor-pointer"
                        >
                            {Texts.HOMEPAGE}
                        </a>

                        <CustomButton disabled={location.pathname == Paths.CREATE_TEMPLATE}
                                      onClick={() => {
                                          setShowSheet(false)
                                          navigate(Paths.CREATE_TEMPLATE)
                                      }
                                      }>
                            {Texts.CREATE_A_TEMPLATE}
                        </CustomButton>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 w-full">


                <CustomButton variant="tertiary" //disabled={location.pathname == Paths.CREATE_TEMPLATE}
                              onClick={() => {
                                  if (AuthenticationService.current) {
                                      setShowCreateTemplateSheet(true)
                                  } else {
                                      setShowSignInSheet(true)
                                  }
                              }}
                              className="hidden md:flex ml-auto">
                    <BadgePlus className="h-4 w-4 mr-2"/>
                    {Texts.CREATE_A_TEMPLATE}
                </CustomButton>

                <div className="flex-1 sm:flex-initial">

                    <div className="flex-1 md:w-full md:flex-none">
                        <CustomButton variant="tertiary" onClick={() => setOpen(true)}
                                      className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64">
                            <span className="hidden lg:inline-flex font-bold">{Texts.SEARCH_TIER_LISTS}</span>
                            <span className="inline-flex lg:hidden">{Texts.SEARCH}</span>
                            <kbd
                                className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span
                                className="text-xs">⌘</span>K</kbd>
                        </CustomButton>

                    </div>
                </div>
                {AuthenticationService.current && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <CustomButton variant="icon" className="rounded-full">
                                {/*<CircleUser className="h-5 w-5"/>*/}

                                <img referrerPolicy="no-referrer" className="w-full h-full rounded-full"
                                     src={AuthenticationService.current.imgUrl}/>

                            </CustomButton>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{Texts.MY_ACCOUNT}</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => navigate(Paths.PROFILE)}>
                            <Settings className="h-4 w-4 mr-2"/>
                            {Texts.PROFILE}

                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={supportModalController.open}>
                            <MessageCircleQuestion className="h-4 w-4 mr-2"/>
                            {Texts.SUPPORT}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={AuthenticationService.signOut}>
                            <LogOut className="h-4 w-4 mr-2"/>
                            {Texts.LOGOUT}
                        </DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>}

                {!AuthenticationService.current &&
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{Texts.MY_ACCOUNT}</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={() => setShowSignInSheet(true)}>
                                <LogIn className="h-4 w-4 mr-2"/>
                                {Texts.SIGN_IN}
                            </DropdownMenuItem>


                        </DropdownMenuContent>

                    </DropdownMenu>
                }

                {/*<ModeToggle/>*/}
            </div>

        </header>

        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder={Texts.TYPE_COMMAND_OR_SEARCH_TIER_LIST}/>
            <CommandList>
                <CommandEmpty>
                    {Texts.NO_RESULT}
                </CommandEmpty>
                <CommandGroup heading={Texts.TIER_LISTS}>
                    {searchTierlists.map((tierlist) => (
                        <CommandItem onSelect={() => {
                            navigate(
                                PathUtils.getCreateTierlistPath(tierlist)
                            )
                            setOpen(false)
                        }} key={tierlist.id}>
                            {tierlist.name}
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator/>
                <CommandGroup heading={Texts.SETTINGS}>
                    <CommandItem onSelect={() => {
                        navigate(Paths.PROFILE)
                        setOpen(false)
                    }
                    }>
                        <User className="h-4 w-4 mr-2"/>
                        {Texts.PROFILE}
                    </CommandItem>

                    <CommandItem onSelect={() => {
                        supportModalController.open()
                        setOpen(false)
                    }}>
                        <MessageCircleQuestion className="h-4 w-4 mr-2"/>
                        {Texts.SUPPORT}
                    </CommandItem>
                </CommandGroup>

            </CommandList>

        </CommandDialog>

    </div>


}
