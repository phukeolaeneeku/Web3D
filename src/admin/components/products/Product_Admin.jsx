import "./product_Admin.css";
import productImage from "../../../img/productImage.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import { BiPlus } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import imageicon from "../../../img/imageicon.jpg";
import banner_no from "../../../img/banner_no.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Picture1 from "../../../img/Picture1.png";
import { GrStatusGoodSmall } from "react-icons/gr";

const Product_Admin = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [filter, set_filter] = useState(1);
  const [category_name, set_category_name] = useState("All");
  const [categories, set_categories] = useState([]);
  const [stores, set_stores] = useState([]);
  const navigate = useNavigate();
  const [background_image, set_background_image] = useState(null);
  const [goods_list, set_goods_list] = useState([]);

  const [id, set_id] = useState(null);
  const [data, set_data] = useState(null);
  const [point_data, set_point_data] = useState(null);
  const [point_image, set_point_image] = useState(null);
  const [data_array, set_data_array] = useState([]);
  const [data_color, setData_color] = useState([]);

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/all-stores",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_stores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /////////////// Add Sizes //////////////
  useEffect(() => {
    const extractedNames = data_array.map((item) => item.name);
    setSizes(extractedNames);
  }, [data_array]);

  const handleSizeInputChange = (e, index) => {
    const { value } = e.target;
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };

  const addSizeInput = () => {
    if (currentSize.trim() !== "") {
      setSizes([...sizes, currentSize]);
      setCurrentSize("");
    }
  };

  const addColorInput = () => {
    if (currentColor.trim() !== "") {
      setColors([...colors, currentColor]);
      setCurrentColor("");
    }
  };

  // const removeSizeInput = (sizeIndex) => {
  //   const updatedSizes = [...sizes];
  //   updatedSizes.splice(sizeIndex, 1);
  //   setSizes(updatedSizes);
  // };
  /////////////////////// Add Colors
  useEffect(() => {
    const extractedNames = data_color.map((item) => item.name);
    setColors(extractedNames);
  }, [data_color]);

  const handleColorInputChange = (e, index) => {
    const { value } = e.target;
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  // const addColorInput = () => {
  //   if (currentColor.trim() !== "") {
  //     setColors([...colors, currentColor]);
  //     setCurrentColor("");
  //   }
  // };

  const removeColorInput = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const removeSizeInput = (sizeIndex) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(sizeIndex, 1);
    setSizes(updatedSizes);
  };
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const [selectedImages, setSelectedImages] = useState(null);
  const [updateProductId, setUpdateProductId] = useState(null);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [isConfirmationPopupOpenPrice, setConfirmationPopupOpenPrice] =
    useState(false);
  const [isConfirmationPopupOpenCategory, setConfirmationPopupOpenCategory] =
    useState(false);
  const [isConfirmationDesc, setConfirmationDesc] = useState(false);
  const [isConfirmationPoint, setConfirmationPoint] = useState(false);
  const [isConfirmationX_axis, setConfirmationX_axis] = useState(false);
  const [isConfirmationY_axis, setConfirmationY_axis] = useState(false);
  const [isConfirmationSize, setConfirmationSize] = useState(false);
  const [isConfirmationColor, setConfirmationColor] = useState(false);
  const [isConfirmationPopupOpenImage, setConfirmationPopupOpenImage] =
    useState(false);
  const [mainImageBanner, setMainImageBanner] = useState(null);
  const [mainImageCategory, setMainImagCategory] = useState(null);

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();

          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        navigate("/loginuser");
        return;
      });
  }, [token]);

  useEffect(() => {
    let my_url = "";
    if (storage) {
      if (!storage.is_admin && store_id) {
        my_url = `/store/?store_id=${store_id}`;
      } else {
        my_url = `/store/`;
      }
    } else {
      my_url = `/store/`;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          set_goods_list(response.data);
        } else {
          set_goods_list([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let my_url = "";
    if (!storage.is_admin) {
      my_url = `/store/?store_id=${store_id}`;
    } else {
      my_url = `/store/`;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          set_goods_list(response.data);
        } else {
          console.error("Expected an array of goods");
        }
      })
      .catch((error) => {
        console.log("Error fetching goods:", error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_background_image(response.data[0].background);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [background_image]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };

  ///Choose image handleImageBanner
  const handleImageBanner = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };
  ///Choose image handleImagePoint
  const handleImagePoint = (e) => {
    const file = e.target.files[0];
    set_point_image(file);
  };

  ///Choose image handleImageProductCategory
  const handleImageProductCategory = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };

  //// onClick icon edit product name
  const openConfirmationPopup = (id) => {
    set_id(id);
    setConfirmationPopupOpen(true);
  };

  const closeConfirmationPopup = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpen(false);
  };

  //// onClick icon camera product image
  const openConfirmationPopupImage = (id) => {
    set_id(id);
    setConfirmationPopupOpenImage(true);
  };

  const closeConfirmationPopupImage = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenImage(false);
    setSelectedImages(null);
  };

  const openConfirmationPopupPrice = (id) => {
    set_id(id);
    setConfirmationPopupOpenPrice(true);
  };

  const closeConfirmationPopupPrice = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenPrice(false);
  };

  const openConfirmationPopupCategory = (id) => {
    set_id(id);
    setConfirmationPopupOpenCategory(true);
  };

  const closeConfirmationPopupCategory = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenCategory(false);
  };

  const openConfirmationDesc = (id) => {
    set_id(id);
    setConfirmationDesc(true);
  };

  const closeConfirmationDesc = () => {
    set_data(null);
    set_id(null);
    setConfirmationDesc(false);
  };

  const openConfirmationPoint = (id) => {
    set_id(id);
    setConfirmationPoint(true);
  };

  const closeConfirmationPoint = () => {
    set_id(null);
    setConfirmationPoint(false);
  };

  const openConfirmationX_axis = (id) => {
    set_id(id);
    setConfirmationX_axis(true);
  };

  const closeConfirmationX_axis = () => {
    set_data(null);
    set_id(null);
    setConfirmationX_axis(false);
  };
  const openConfirmationY_axis = (id) => {
    set_id(id);
    setConfirmationY_axis(true);
  };

  const closeConfirmationY_axis = () => {
    set_data(null);
    set_id(null);
    setConfirmationY_axis(false);
  };

  const openConfirmationSize = (id, sizes) => {
    set_id(id);
    set_data_array(sizes);
    setConfirmationSize(true);
  };

  const closeConfirmationSize = () => {
    setConfirmationSize(false);
    set_data(null);
    set_id(null);
    setCurrentSize(null);
    setSizes([]);
  };

  const openConfirmationColor = (id, colors) => {
    setData_color(colors);
    set_id(id);
    setConfirmationColor(true);
  };

  const closeConfirmationColor = () => {
    setColors([]);
    set_data(null);
    set_id(null);
    setCurrentColor(null);
    setConfirmationColor(false);
  };

  // Choose banner image
  const [isPopupimage, setPopupimage] = useState(false);
  const togglePopupimage = () => {
    setPopupimage(true);
  };

  const togglePopupCancelimage = () => {
    setPopupimage(false);
    set_data(null);
  };
  // Choose point image
  const [isPopupPointimage, setPopupPointimage] = useState(false);
  const togglePopupPointimage = () => {
    setPopupPointimage(true);
  };

  const togglePopupCancelPointimage = () => {
    setPopupPointimage(false);
    set_data(null);
  };

  // Choose Category image
  const [isPopupName, setPopupName] = useState(false);
  const togglePopupName = (id) => {
    setPopupName(true);
    set_id(id);
  };
  const togglePopupCancelName = () => {
    setPopupName(false);
    set_id(null);
    set_data(null);
  };

  // Choose banner image
  const [isPopupImageCategory, setPopupImageCategory] = useState(false);

  const togglePopupImageCategory = (id) => {
    setPopupImageCategory(true);
    set_id(id);
  };

  const togglePopupCancelImageCategory = () => {
    setPopupImageCategory(false);
    set_id(null);
    set_data(null);
  };

  // Submit button
  const ChangeBackgroundImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("background", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/web-info/2`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        MySwal.fire({
          text: "Update image banner successful.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupimage(false);
        window.location.reload(false);
      })
      .catch((error) => {
        console.error(error);
        alert("This image file is too large, please choice another image.");
      });
  };
  // Submit button

  const ChangeCategoryImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/categories/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        MySwal.fire({
          text: "Category image has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupImageCategory(false);
      })
      .catch((error) => console.error(error));
  };

  const ChangeCategoryName = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/categories/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        MySwal.fire({
          text: "Category name has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupName(false);
      })
      .catch((error) => console.error(error));
  };

  /////////////////////handleDelete
  const handleDelete = (id) => {
    MySwal.fire({
      title: "Confirm deletion?",
      text: "Are you sure you want to delete product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let data = JSON.stringify({
          goods_id: id,
        });

        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/goods`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            MySwal.fire({
              text: "Successful delete the product.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleDeleteCategory = (categoryId) => {
    MySwal.fire({
      title: "Confirm deletion?",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/categories/${categoryId}`,
          headers: {
            "Content-Type": "application/json",
          },
        };

        axios
          .request(config)
          .then((response) => {
            MySwal.fire({
              text: "Category has been deleted.",
              icon: "success",
            });
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error:", error);
            MySwal.fire({
              text: "Cannot delete this category.",
              icon: "error",
            });
          });
      }
    });
  };

  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [directions, setDirections] = useState("right");

  const handlePrevSlide = () => {
    if (setCurrentImageIndex.length === 0) {
      return;
    }
    setDirections("left");
    setActiveSlide(
      activeSlide === 0 ? setCurrentImageIndex.length - 1 : activeSlide - 1
    );
  };

  const handleNextSlide = () => {
    setDirections("right");
    const nextIndex = (activeSlide + 1) % setCurrentImageIndex.length;
    setActiveSlide(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 360000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const [isDragging, setIsDragging] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const imageRef = useRef(null);

  const updateCoordinates = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCoordinates({ x: Math.round(x), y: Math.round(y) });
  };

  const closeConfirmationProductID = () => {
    set_data(null);
    set_id(null);
    setShowPopup(false);
  };

  /////////////// Add product //////////////

  const [products, setProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      category: "",
      x_axis: [],
      y_axis: [],
      sizes: [],
      colors: [],
      images: [],
      imagePreview: "",
    },
  ]);

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();

          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        navigate("/loginuser");
        return;
      });
  }, []);

  const handleProductName = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].name = value;
    setProducts(updatedProducts);
  };

  const handleProductCategory = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].category = value;
    setProducts(updatedProducts);
  };

  const handleProductPrice = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].price = value;
    setProducts(updatedProducts);
  };

  const handleProductDescription = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].description = value;
    setProducts(updatedProducts);
  };

  const handleImageProduct = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProducts = [...products];
        updatedProducts[index].images.push(reader.result);
        updatedProducts[index].imagePreview = reader.result;
        setProducts(updatedProducts);
      };
      reader.onerror = () => {
        console.error("Error reading the file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeInputChangeProduct = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentsizes = value;
    setProducts(updatedProducts);
  };

  const addSizeInputProduct = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentsizes.trim() !== "") {
      updatedProducts[index].sizes.push(updatedProducts[index].currentsizes);
      updatedProducts[index].currentsizes = "";
      setProducts(updatedProducts);
    }
  };

  const removeSizeInputProduct = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].sizes.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  const handleColorInputChangeProduct = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentcolors = value;
    setProducts(updatedProducts);
  };

  const addColorInputProduct = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentcolors.trim() !== "") {
      updatedProducts[index].colors.push(updatedProducts[index].currentcolors);
      updatedProducts[index].currentcolors = "";
      setProducts(updatedProducts);
    }
  };

  const removeColorInputProduct = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].colors.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  ////////// List displayed point ///////////
  const [point, setPoint] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}/stocked`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setPoint(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id]);

  // console.log("point....", point)

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [selectedPointImages, setSelectedPointImages] = useState([]);
  const [selectedPointView, setSelectedPointView] = useState(null);
  const [imags, setImags] = useState([]);

  const image_id = imags[currentImageIndex]?.id;

  // console.log("image_idimage_id......", image_id);

  useEffect(() => {
    const imagesWithIds = selectedPointImages.map((image) => ({
      id: image.id,
      image: image.image,
    }));
    setImags(imagesWithIds);
  }, [selectedPointImages]);

  const handlePointClick = (id) => {
    // ป้องกันการรีเฟรช
    event.preventDefault();
    const pointItem = point.find((pointItem) => pointItem.id === id);
    if (pointItem) {
      setSelectedPointId(id);
      setSelectedPointView(pointItem.point_view === id);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/stocked/${id}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.images && response.data.images.length > 0) {
            setSelectedPointImages(response.data.images);
            setActiveSlide(0);
          } else {
            setSelectedPointImages([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
          setSelectedPointImages([]);
        });
    } else {
      console.log("Point item not found");
    }
  };

  const Updatepoint = () => {
    let data = new FormData();
    data.append("point_view", point_data);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/stocked/${id}/update`,
      headers: {
        ...data,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_point_data(response.data);
        MySwal.fire({
          text: "Point name has been change.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeProductName = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: data,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,

      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationPopupOpen(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product name has been change.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductPrice = () => {
    const formdata = new FormData();
    formdata.append("price", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationPopupOpenPrice(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product price has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("images", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        MySwal.fire({
          text: "Product image has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setConfirmationPopupOpenImage(false);
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductCategory = () => {
    const formdata = new FormData();
    formdata.append("category", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationPopupOpenCategory(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product table or category has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductDescription = () => {
    const formdata = new FormData();
    formdata.append("description", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationDesc(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product description has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductX_axis = () => {
    const formdata = new FormData();
    formdata.append("x_axis", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationX_axis(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product description has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };
  const ChangeProductY_axis = () => {
    const formdata = new FormData();
    formdata.append("y_axis", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmationY_axis(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product description has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductSizes = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      sizes: data,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {;
        setConfirmationSize(false);
        setCurrentSize(null);
        set_data(null);
        set_id(null);
        set_data_array([]);
        MySwal.fire({
          text: "Product sizes has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeProductColors = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      colors: data,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/${id}/update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setConfirmationColor(false);
        setCurrentColor(null);
        set_data(null);
        set_id(null);
        set_data_array([]);
        MySwal.fire({
          text: "Product colors has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  const ChangeBackgroundPoint = () => {
    const formdata = new FormData();
    formdata.append("image", point_image);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/stocked-image/${image_id}/update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        MySwal.fire({
          text: "Update image has been changed successfully.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        MySwal.fire({
          text: "Failed to update image.",
          icon: "error",
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const post of products) {
      if (post.name.trim() === "") {
        Swal.fire({
          text: "Please enter a product name!",
          icon: "question",
        });
        return;
      }
    }

    for (const post of products) {
      if (post.price.trim() === "") {
        Swal.fire({
          text: "Please enter a product price!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.category.trim() === "") {
        Swal.fire({
          text: "Please enter choose category!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.description.trim() === "") {
        Swal.fire({
          text: "Please enter a product description!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.sizes.length === 0) {
        Swal.fire({
          text: "Please enter a product sizes!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.colors.length === 0) {
        Swal.fire({
          text: "Please enter a product colors!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.images.length === 0) {
        Swal.fire({
          text: "Please enter a product images!",
          icon: "question",
        });
        return;
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/store/${
          storage.store_id
        }/stocked-image/${image_id}/goods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goods_set: products.map((product) => ({
              ...product,
              x_axis: coordinates.x.map((coord) => parseFloat(coord)),
              y_axis: coordinates.y.map((coord) => parseFloat(coord)),
            })),
          }),
        }
      );

      if (!response.ok) {
        MySwal.fire({
          text: "Add product failed.",
          icon: "question",
        });
        console.log(response);
        throw new Error("Add product failed.");
      }

      const data = await response.json();
      MySwal.fire({
        text: "Product addition has been completed..",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Add product error:", error.message);
    }
  };

  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const [coordinates, setCoordinates] = useState({
    x: [],
    y: [],
  });

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = 500 - (e.clientY - rect.top);

    setStartPoint({ x, y });
    setEndPoint({ x, y });

    setIsDrawing(true);
    // setShowPopup(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      setShowPopup(false);
      return;
    }

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = 500 - (e.clientY - rect.top);

    setEndPoint({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setShowPopup(true);

    const xCoords = [startPoint.x, endPoint.x].sort((a, b) => a - b);
    const yCoords = [startPoint.y, endPoint.y].sort((a, b) => a - b);

    setCoordinates({
      x: xCoords.map((x) => x.toFixed(2)),
      y: yCoords.map((y) => y.toFixed(2)),
    });
  };

  useEffect(() => {
    const updatedProducts = products.map((product) => ({
      ...product,
      x_axis: coordinates.x.filter((coord) => coord && coord.trim() !== ""),
      y_axis: coordinates.y.filter((coord) => coord && coord.trim() !== ""),
    }));
    setProducts(updatedProducts);
  }, [coordinates]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/${storage.store_id}/stocked-image/${image_id}/goods/list`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [image_id, storage.store_id]);

  useEffect(() => {
    const imagesWithIds = selectedPointImages.map((image) => ({
      id: image.id,
      image: image.image,
    }));
    setImags(imagesWithIds);
  }, [selectedPointImages]);

  return (
    <>
      <AdminMenu />
      <section id="product_admin">
        <div className="container_body_admin_product">
          <div className="productHead_content">
            <h1 className="htxthead">
              <span className="spennofStyleadmin"></span>Product
            </h1>
          </div>
          <div className="banner_no_box">
            <div className="banner_no_box_image">
              <div className="img">
                {background_image ? (
                  <img
                    src={import.meta.env.VITE_API + background_image}
                    alt="Banner"
                  />
                ) : (
                  <img src={banner_no} alt="Banner" />
                )}
              </div>
            </div>
            {storage.is_admin === true && (
              <div className="edit_image_banner" onClick={togglePopupimage}>
                <CiCamera id="box_icon_camera" />
              </div>
            )}

            {isPopupimage && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeBackgroundImage}
              >
                <div className="hover_addproductpopup_box_image">
                  <div className="box_input_image">
                    <p>Edit banner image</p>
                    <label className="popup_Border_Boximagae">
                      {data ? (
                        <img src={URL.createObjectURL(data)} alt="Banner" />
                      ) : (
                        <img src={imageicon} alt="Banner" />
                      )}
                      <input
                        type="file"
                        id="img"
                        onChange={handleImageBanner}
                        required
                      />
                      <p className="box_choose_image">Choose img</p>
                    </label>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelimage}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="box_category">
            {storage.is_admin === true
              ? categories.map((category, index) => (
                  <div className="box_contact_category" key={index}>
                    <div className="img">
                      <img src={category.image} alt="img" />
                    </div>
                    <div
                      className="ChooseImage_category"
                      onClick={() => {
                        togglePopupImageCategory(category.id);
                      }}
                    >
                      <CiCamera id="iconCamera_category" />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <p>{category.name}</p>
                      <div
                        className="box_MdOutlineEdit"
                        onClick={() => {
                          togglePopupName(category.id);
                        }}
                      >
                        <MdOutlineEdit id="icon_edit_MdOutlineEdit" />
                      </div>
                    </div>
                    <div
                      className="box_delete_category"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <AiOutlineDelete />
                    </div>
                  </div>
                ))
              : categories.map((category, index) => (
                  <div className="box_contact_category" key={index}>
                    <div className="img">
                      <img src={category.image} alt="img" />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <p>{category.name}</p>
                    </div>
                  </div>
                ))}

            {isPopupImageCategory && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeCategoryImage}
              >
                <div className="hover_addproductpopup_box_image">
                  <div className="box_input_image">
                    <p>Edit Category image</p>
                    <label className="popup_Border_Boximagae">
                      {data ? (
                        <img src={URL.createObjectURL(data)} alt="category" />
                      ) : (
                        <img src={imageicon} alt="category" />
                      )}
                      <input
                        type="file"
                        id="img"
                        onChange={handleImageProductCategory}
                        required
                      />
                      <p className="box_choose_image">Choose img</p>
                    </label>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelImageCategory}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isPopupName && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeCategoryName}
              >
                <div className="hover_addproductpopup_box">
                  <div className="box_input">
                    <p>Edit category name</p>
                    <input
                      type="text"
                      placeholder="Name..."
                      className="input_of_txtAddproduct"
                      value={data}
                      onChange={(e) => {
                        set_data(e.target.value);
                      }}
                    />
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelName}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="productHead_content_point">
            <Link to="/delete_point" className="box_add_product">
              <BiPlus id="icon_add_product" />
              <p>Delete Point</p>
            </Link>
            <Link to="/add_point" className="box_add_product">
              <BiPlus id="icon_add_product" />
              <p>Add Point</p>
            </Link>
          </div>

          <div className="containner_slide_box3D_point_admin">
            <div className="slider_box3D_admin">
              <div
                ref={imageRef}
                style={{ position: "relative", display: "inline-block" }}
                className="slide_box3D_admin"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <svg  className="line-overlay">
                  <image
                    href={imags[currentImageIndex]?.image}
                    width="500"
                    height="500"
                    preserveAspectRatio="none"
                  />
                  {isDrawing && (
                    <line
                      x1={startPoint.x}
                      y1={500 - startPoint.y}
                      x2={endPoint.x}
                      y2={500 - endPoint.y}
                      stroke="red"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>

              <div className="edit_image_banner_point">
                <CiCamera
                  id="box_icon_camera"
                  onClick={togglePopupPointimage}
                />
              </div>

              <div className=" but1_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev > 0 ? prev - 1 : imags.length - 1
                    )
                  }
                >
                  &#8249;
                </div>
              </div>
              <div className=" but2_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev < imags.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  &#8250;
                </div>
              </div>
            </div>

            <div className="containner_point_admin">
              <div style={{ overflow: point.length > 4 ? 'auto' : 'hidden' }}>
                {point.length > 0 ? (
                  point.map((pointItem, index) => (
                    <div className="box_GrStatusGoodSmall_admin" key={index}>
                      <div
                        className="GrStatusGoodSmall_admin"
                        onClick={() => handlePointClick(pointItem.id)}
                      ></div>
                      <div className="point_view_name">
                        <p>{pointItem.point_view}</p>
                        <MdOutlineEdit
                          id="icon_edit_point"
                          onClick={() => openConfirmationPoint(pointItem.id)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>

          {isConfirmationPoint && (
            <div className="background_addproductpopup_box">
              <div className="hover_addproductpopup_box">
                <div className="box_input">
                  <p>Edit point name</p>
                  <input
                    type="text"
                    placeholder="Point name..."
                    className="input_of_txtAddproduct"
                    onChange={(e) => {
                      set_point_data(e.target.value);
                    }}
                  />
                </div>
                <div className="btn_foasdf">
                  <button
                    className="btn_cancel btn_addproducttxt_popup"
                    onClick={closeConfirmationPoint}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn_confirm btn_addproducttxt_popup"
                    onClick={() => Updatepoint()}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPopupPointimage && (
            <form
              className="background_addproductpopup_box"
              onSubmit={ChangeBackgroundPoint}
            >
              <div className="hover_addproductpopup_box_image">
                <div className="box_input_image">
                  <p>Edit point image</p>
                  <label className="popup_Border_Boximagae">
                    {point_image ? (
                      <img
                        src={URL.createObjectURL(point_image)}
                        alt="Banner"
                      />
                    ) : (
                      <img src={imageicon} alt="Banner" />
                    )}
                    <input
                      type="file"
                      id="img"
                      onChange={handleImagePoint}
                      required
                    />
                    <p className="box_choose_image">Choose img</p>
                  </label>
                </div>
                <div className="btn_foasdf">
                  <button
                    className="btn_cancel btn_addproducttxt_popup"
                    onClick={togglePopupCancelPointimage}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn_confirm btn_addproducttxt_popup"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          )}

          {showPopup && (
            <div className="group_container_product_popup">
              {products.map((post, index) => (
                <div className="addProduct_box_content_after_popup" key={index}>
                  <div className="box_input-img">
                    {post.imagePreview ? (
                      <img src={post.imagePreview} alt="product" />
                    ) : (
                      <img src={imageicon} alt="default" />
                    )}
                    <input
                      type="file"
                      id={`img-${index}`}
                      onChange={(e) => handleImageProduct(e, index)}
                      required
                    />
                  </div>

                  <div className="edit_images">
                    <label
                      htmlFor={`img-${index}`}
                      className="trigger_popup_fricc"
                    >
                      <CiCamera id="icon_ci_camera" />
                    </label>
                  </div>
                  <div className="box_container_image">
                    <div className="input-box">
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={post.name}
                          onChange={(e) => handleProductName(e, index)}
                        />
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Price"
                          value={post.price}
                          onChange={(e) => handleProductPrice(e, index)}
                        />
                      </div>

                      <div className="box">
                        <select
                          name="category"
                          className="product_category"
                          onChange={(e) => handleProductCategory(e, index)}
                        >
                          <option className="inputproduct" value="1">
                            Select table or category
                          </option>
                          {point.map((item, index) => (
                            <option key={index} value={item.point_view}>
                              {item.point_view}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Description"
                          value={post.handleProductDescription}
                          onChange={(e) => handleProductDescription(e, index)}
                        />
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Coordinates X"
                          value={coordinates.x.join(", ")}
                          required
                          readOnly
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Coordinates Y"
                          value={coordinates.y.join(", ")}
                          required
                          readOnly
                        />
                      </div>

                      <div className="box_size_product_container">
                        <div className="box_size_add">
                          {post.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="box_size_add_item">
                              <p>{size}</p>
                              <span
                                onClick={() =>
                                  removeSizeInputProduct(index, sizeIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Sizes..."
                            value={post.currentsizes || ""}
                            onChange={(e) =>
                              handleSizeInputChangeProduct(e, index)
                            }
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addSizeInputProduct(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>

                      <div className="box_size_product_containerWeb3d">
                        <div className="box_size_add">
                          {post.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="box_size_add_item">
                              <p>{color}</p>
                              <span
                                onClick={() =>
                                  removeColorInputProduct(index, colorIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Colors..."
                            value={post.currentcolors || ""}
                            onChange={(e) =>
                              handleColorInputChangeProduct(e, index)
                            }
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addColorInputProduct(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>

                      <div className="CancelAndSave">
                        <button
                          className="BTNCancel"
                          onClick={closeConfirmationProductID}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="BTNSave"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div id="container_product_admin">
            <div className="productHead_content">
              <h1 className="htxthead">
                <span className="spennofStyle"></span>ALL Product
              </h1>
            </div>
            <div className="contentImageProducts">
              {goods_list.map((product, index) => (
                <div className="box_product" key={index}>
                  <div className="box_input-img">
                    <div className="box_image">
                      <img src={product.images} alt="Product" />
                      <input
                        type="file"
                        id={`image-${index}`}
                        onChange={(e) => handleImage(e, index)}
                        required
                      />
                    </div>

                    <div
                      className="Box_delete_product"
                      onClick={() => handleDelete(product.id)}
                    >
                      <AiOutlineDelete />
                    </div>

                    <div
                      className="edit_image_product"
                      onClick={() => openConfirmationPopupImage(product.id)}
                    >
                      <CiCamera id="box_icon_camera_product" />
                    </div>

                    {isConfirmationPopupOpenImage && (
                      <form
                        className="box_formUpdate"
                        onSubmit={ChangeProductImage}
                      >
                        <div className="formUpdate">
                          <div className="imageBox">
                            <p>Edit product image</p>
                            <label>
                              {data ? (
                                <img
                                  src={URL.createObjectURL(data)}
                                  alt="product"
                                />
                              ) : (
                                <img src={imageicon} alt="product" />
                              )}
                              <input
                                type="file"
                                id={`image-${index}`}
                                onChange={(e) => handleImage(e, index)}
                                required
                              />
                              <div className="choose">
                                <p>Choose img</p>
                              </div>
                            </label>
                          </div>
                          <div className="btn-update-del">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupImage}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              type="submit"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="txtOFproduct">
                    <div className="box_icon_MdOutlineEdit">
                      <li>ProductName: {product.name}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationPopup(product.id)}
                      />
                    </div>
                    {isConfirmationPopupOpen && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product name</p>
                            <input
                              type="text"
                              placeholder="Name..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopup}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={(e) => {
                                ChangeProductName(e);
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="box_icon_MdOutlineEdit">
                      <li>Price: ${product.price}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationPopupPrice(product.id)}
                      />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <li>Category: {product.category}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          openConfirmationPopupCategory(product.id)
                        }
                      />
                    </div>

                    {isConfirmationPopupOpenCategory && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit category</p>
                            <div className="box2">
                              <select
                                name="category"
                                className="product_category_filter"
                                required
                                onChange={(e) => set_data(e.target.value)}
                              >
                                <option className="inputproduct" value="">
                                  Select table or category
                                </option>
                                {point.map((item, index) => (
                                  <option key={index} value={item.point_view}>
                                    {item.point_view}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupCategory}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductCategory();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationPopupOpenPrice && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product price</p>
                            <input
                              type="text"
                              placeholder="Price..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupPrice}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductPrice();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="box_icon_MdOutlineEdit">
                      <li>Desc: {product.description}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationDesc(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>X_axis: {JSON.stringify(product.x_axis)}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationX_axis(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>Y_axis: {JSON.stringify(product.y_axis)}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationY_axis(product.id)}
                      />
                    </div>

                    {isConfirmationDesc && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit Description</p>
                            <input
                              type="text"
                              placeholder="Description..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationDesc}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductDescription();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isConfirmationX_axis && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit X_axis</p>
                            <input
                              type="text"
                              placeholder="X_axis..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationX_axis}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductX_axis();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationY_axis && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit Y_axis</p>
                            <input
                              type="text"
                              placeholder="Y_axis..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationY_axis}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductY_axis();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="box_icon_MdOutlineEdit">
                      {/* <li>Size: {product.size}</li> */}
                      <li>
                        Size: {product.sizes ? product.sizes.join(", ") : ""}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          openConfirmationSize(product.id, product.sizes)
                        }
                      />
                    </div>
                   
                    <div className="box_icon_MdOutlineEdit">
                      <li>
                        Color: {product.colors ? product.colors.join(", ") : ""}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          openConfirmationColor(product.id, product.colors)
                        }
                      />
                    </div>
                    {/* {isConfirmationSize && (
                      <div className="background_addproductpopup_box">
                        <div className="addproductpopup_box">
                          <div className="box_size_input">
                            <p>Edit product size</p>
                            <div className="box_size_container">
                              <div className="box_size_add">
                                {product.sizes.map((size, sizeIndex) => (
                                  <div
                                    key={sizeIndex}
                                    className="box_size_add_item"
                                  >
                                    <p>{size}</p>
                                    <span
                                      onClick={() => removeSizeInput(sizeIndex)}
                                    >
                                      <MdClose id="icon_MdClose" />
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="box_size_content">
                                <input
                                  type="text"
                                  placeholder="Add Sizes..."
                                  value={currentSize}
                                  onChange={(e) =>
                                    setCurrentSize(e.target.value)
                                  }
                                />
                                <div
                                  className="btn_addsize"
                                  onClick={() => addSizeInput()}
                                >
                                  Add
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationSize}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductSizes();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )} */}
                    {isConfirmationSize && (
                      <div className="background_addproductpopup_box">
                        <div className="addproductpopup_box">
                          <div className="box_size_input">
                            <p>Edit product color</p>
                            <div className="box_size_container">
                              <div className="box_size_add">
                                {sizes.map((size, sizeIndex) => (
                                  <div
                                    key={sizeIndex}
                                    className="box_size_add_item"
                                  >
                                    <p>{size}</p>
                                    <span
                                      onClick={() =>
                                        removeSizeInput(sizeIndex)
                                      }
                                    >
                                      <MdClose id="icon_MdClose" />
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="box_size_content">
                                <input
                                  type="text"
                                  placeholder="Add Colors..."
                                  value={currentSize}
                                  onChange={(e) =>
                                    setCurrentSize(e.target.value)
                                  }
                                />
                                <div
                                  className="btn_addsize"
                                  onClick={() => addSizeInput()}
                                >
                                  Add
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationSize}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductSizes();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationColor && (
                      <div className="background_addproductpopup_box">
                        <div className="addproductpopup_box">
                          <div className="box_size_input">
                            <p>Edit product color</p>
                            <div className="box_size_container">
                              <div className="box_size_add">
                                {colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="box_size_add_item"
                                  >
                                    <p>{color}</p>
                                    <span
                                      onClick={() =>
                                        removeColorInput(colorIndex)
                                      }
                                    >
                                      <MdClose id="icon_MdClose" />
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="box_size_content">
                                <input
                                  type="text"
                                  placeholder="Add Colors..."
                                  value={currentColor}
                                  onChange={(e) =>
                                    setCurrentColor(e.target.value)
                                  }
                                />
                                <div
                                  className="btn_addsize"
                                  onClick={() => addColorInput()}
                                >
                                  Add
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationColor}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductColors();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product_Admin;
