import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import State from "@/types/State";
import ApiService from "@/services/ApiService";
import {toast} from "sonner";
import Texts from "@/text/Texts";


interface GoogleImageSearchControllerOptions extends ModalControllerOptions {
    multiple?: boolean;
    setImages: (images: { src: string, title: string }[]) => Promise<void>;
    defaultSearch?: string;
    states: {
        showState: State<boolean>;
        currentImages: State<{ src: string, title: string }[]>;
        searchInput: State<string>;
        loadingState: State<boolean>;
        selectedImagesState: State<{ src: string, title: string }[]>;

    }
}

export default class GoogleImageSearchController extends ModalController<GoogleImageSearchControllerOptions> {

    states: GoogleImageSearchControllerOptions['states'];
    multiple: boolean;
    setImages: GoogleImageSearchControllerOptions['setImages'];
    defaultSearch: GoogleImageSearchControllerOptions['defaultSearch'];


    constructor(options: GoogleImageSearchControllerOptions) {
        super(options);
        this.states = options.states;
        this.multiple = options.multiple ?? false;
        this.setImages = options.setImages;
        this.defaultSearch = options.defaultSearch;
    }

    open = () => {
        this.states.searchInput.set("");
        this.states.selectedImagesState.set([]);
        this.states.currentImages.set([]);
        this.states.loadingState.set(false)
        this.states.showState.set(true);

        if (this.defaultSearch) {
            this.states.searchInput.set(this.defaultSearch);
            this.search(this.defaultSearch);
        }

    }

    close = () => {
        this.states.showState.set(false);
    }

    search = async (searchInput?: string) => {

        if (this.states.searchInput.val.trim().length === 0 && !searchInput) return;

        this.states.loadingState.set(true);
        const imagesPromise = ApiService.searchGoogleImages(searchInput ?? this.states.searchInput.val);

        toast.promise(imagesPromise, {
            loading: Texts.LOADING_IMAGES_FOR,
            success: images => {
                this.states.currentImages.set(images);
                this.states.loadingState.set(false);
                return Texts.SUCCESSFULLY_LOADED_IMAGES


            },
            error: () => {
                this.states.loadingState.set(false);
                return Texts.NO_IMAGES_FOUND.replace("{q}", this.states.searchInput.val)
            }
        });
    }

    selectedImage = (image: { src: string, title: string }) => {
        const selectedImages = this.states.selectedImagesState.val;
        if (!this.multiple) {
            this.states.selectedImagesState.set([image]);
            return;
        }

        this.states.selectedImagesState.set([...selectedImages, image]);
    }


    unselectImage = (image: { src: string, title: string }) => {
        const selectedImages = this.states.selectedImagesState.val;
        this.states.selectedImagesState.set(selectedImages.filter(img => img.src !== image.src));
    }

    isSelected = (image: { src: string, title: string }) => {
        return this.states.selectedImagesState.val.includes(image);
    }

    toggleSelected = (image: { src: string, title: string }) => {
        if (this.isSelected(image)) {
            this.unselectImage(image);
        } else {
            this.selectedImage(image);
        }
    }

    submit = () => {
        if (this.states.selectedImagesState.val.length === 0) return;
        const promise = this.setImages(this.states.selectedImagesState.val);
        toast.promise(promise, {
            loading: Texts.ADD_IMAGES,
            success: () => {
                this.close();
                return Texts.ADDED_IMAGES
            },
            error: Texts.FAILED_TO_ADD_IMAGES
        });
    }

}


