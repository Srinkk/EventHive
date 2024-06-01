import {
  View,
  Text,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { eventApi } from "../../api/eventApi";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";
import icons from "../../constants/icons"

const CreateEvent = ({addEvent,setAddEvent}) => {
  const navigation = useNavigation()
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [eventName, setEventName] = useState(null);
  const [dateOfEvent, setDateOfEvent] = useState("");
  const [timeOfEvent, setTimeOfEvent] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [vendors, setVendors] = useState([]);

  const { currentEvent, user,setCurrentEvent } = useGlobalContext();
  const eventId = currentEvent._id;
  const token = user.token;
  
  const onChangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        showDatepicker();
        setDateOfEvent(formatDate(currentDate));
      }
    } else {
      showDatepicker();
    }
  };

  const onChangeTime = ({ type }, selectedTime) => {
    if (type == "set") {
      const currentTime = selectedTime;
      setTime(currentTime);
      if (Platform.OS === "android") {
        showTimepicker();
        setTimeOfEvent(formatTime(currentTime.toTimeString()));
      }
    } else {
      showTimepicker();
    }
  };
  useEffect(() => {
    const handleGetVendors = async () => {
      try {
        const response = await eventApi.getVendors(eventId, token);

        const vendorsList = response.data.data.map((vendor) => ({
          name: vendor.user[0].name,
          service: vendor.serviceType,
          id:vendor._id
        }));
        setVendors(vendorsList);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    handleGetVendors();
  }, []);

  const createDateTime =(dateStr,timeStr)=>{
    const [year, month, day] = dateStr.split('-');

  // Parse the time string and convert to 24-hour format
  let [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  // Create a Date object with the parsed values
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  return date
}
  

const handleAddEventClicked = async () => {
  try {
    const newSubEvent = {
      name: eventName,
      datetime :{
        start: createDateTime(dateOfEvent, timeOfEvent),
        end: createDateTime(dateOfEvent, timeOfEvent)
        },
      location: location,
      vendors: selectedValues,
      autoCreateChannels:createChannel
    };

    const response = await eventApi.createSubEvent(eventId, newSubEvent, token);
    console.log("Set subevent", response.status);
    setAddEvent(!addEvent)

    
  } catch (error) {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response);
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    console.error("Error config:", error.config);
  }
};

  const showDatepicker = () => {
    setShowDate(!showDate);
  };

  const showTimepicker = () => {
    setShowTime(!showTime);
  };

  

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const toggleSelection = (value) => {
    let updatedSelectedValues;
    if (selectedValues.includes(value)) {
      updatedSelectedValues = selectedValues.filter((item) => item !== value);
    } else {
      updatedSelectedValues = [...selectedValues, value];
    }
    setSelectedValues(updatedSelectedValues);
    setInputValue(updatedSelectedValues.join(", "));
  };
  const VendorItem = ({ name, service }) => (
    <View className="flex-row items-center  py-2 border-b border-gray-200">
      <Text className="text-base">{name} - {service}</Text>
    </View>
  );

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString) => {
    const hours = timeString.split(":")[0];
    const minutes = timeString.split(":")[1];
    let parsedHours = parseInt(hours, 10);
    const suffix = parsedHours >= 12 ? "PM" : "AM";
    parsedHours = parsedHours % 12 || 12;
    return `${parsedHours}:${minutes} ${suffix}`;
  };

  const [createChannel, setCreateChannel] = useState(true);

  return (
    <View className="flex gap-[15px] px-2 ">
      <View className="mb-3">
        <View className='flex flex-row justify-between'>
          <Text className="text-2xl font-bold ">Create Event</Text>
          <TouchableOpacity onPress={()=>setAddEvent(!addEvent)}>
            <View className='py-2 px-4 bg-slate-200 rounded-md'>
              <Text className='text-slate-400'>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
       
        <View className="w-[117px] border-[2px] rounded-[3px] mb-3  border-[#FFAD65]"></View>

        <Text>Event Name</Text>
        <TextInput
          className="border-b border-[#1F2E2A]/[0.41] h-[37px]  bg-[#1F2E2A]/[0.01] text-md "
          placeholder="Rajarshis Haldi Ceremony"
          value={eventName}
          onChangeText={(text) => setEventName(text)}
        />
      </View>
      <View className="mb-3">
        <Text>When is it happening</Text>
        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        {!showDate && (
          <TouchableOpacity onPress={showDatepicker}>
            <TextInput
              className="border-b border-[#1F2E2A]/[0.41] h-[37px]  bg-[#1F2E2A]/[0.01] text-md text-black "
              placeholder="Rajarshis Haldi Ceremony"
              value={dateOfEvent}
              onChangeText={setDateOfEvent}
              editable={false}
            />
            <Image
              source={icons.date}
              className="absolute right-0 top-0 w-[24px] h-[24px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-3">
        <Text>At what time</Text>
        {showTime && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
        {!showTime && (
          <TouchableOpacity onPress={showTimepicker}>
            <TextInput
              className="border-b border-[#1F2E2A]/[0.41] h-[37px]  bg-[#1F2E2A]/[0.01] text-md text-black "
              placeholder="Rajarshis Haldi Ceremony"
              value={timeOfEvent}
              onChangeText={setTimeOfEvent}
              editable={false}
            />
            <Image
              source={icons.date}
              className="absolute right-0 top-0 w-[24px] h-[24px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-3">
        <Text>Where is it happening</Text>
        <Picker
          selectedValue={location}
          onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
          className="border border-[#1F2E2A] h-[37px]  bg-[#1F2E2A]/[0.01] text-md text-black "
        >
          <Picker.Item label="floo1 " value="floor1" />
          <Picker.Item label="floo2 " value="floor2" />
          <Picker.Item label="floo3" value="floor3" />
        </Picker>
      </View>
      <View className={`mb-3`}>
        <Text>Select Vendors</Text>
        <TouchableOpacity onPress={toggleDropdown}>
          <TextInput
            className="border-b border-[#1F2E2A]/[0.41] h-[37px]  bg-[#1F2E2A]/[0.01] text-md text-black"
            value={inputValue}
            placeholder="Click to select vendors"
            editable={false}
          />
        </TouchableOpacity>

        {open && (
          <View className="border border-gray-300 rounded">
            {vendors.length === 0 ? (
              <Text className="p-3 text-center text-slate-400">
                No vendors to show
              </Text>
            ) : (
              <FlatList
                data={vendors}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleSelection(item.name)}
                    className="flex px-5 flex-row justify-between items-center"
                  >
                    <VendorItem name={item.name} key={item.id} service={item.service} />

                    {selectedValues.includes(item.name) && (
                      <Text className="text-[#FFAD65] text-xl">✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        )}
        <View className="flex flex-row mt-5 gap-[3px] items-center rounded-md py-2">
          <Text>Selected Vendors: </Text>
          {selectedValues.map((value) => (
            <View className="bg-[#FFAD65]/[0.7] rounded-md p-2">
              <Text>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="flex flex-row items-center ">
        <Switch value={createChannel} onValueChange={setCreateChannel} />
        <Text className="ml-2">Create channel for this event</Text>
      </View>

      <TouchableOpacity
        className="bg-[#FFAD65] border border-[#FFAD65] rounded-md flex items-center  p-2"
        onPress={handleAddEventClicked}
      >
        <Text className="text-xl font-bold text-white">Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateEvent;
