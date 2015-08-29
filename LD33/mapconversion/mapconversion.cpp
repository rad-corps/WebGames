//mapconversion.cpp

#include <iostream>
#include <stdlib.h>

#include <string>
#include <fstream>
#include <streambuf>
#include <regex>

using namespace std;

int main(int argc,  char** argv)
{
	int x = 0;
	std::cout << "Demon Dash Map Conversion Utility" << std::endl;

	//if we got the correct num of args, do the conversion
	if (argc == 2)
	{
		//read the csv file into the program
		std::ifstream mapFile(argv[1]);
		std::string inData((std::istreambuf_iterator<char>(mapFile)), std::istreambuf_iterator<char>());

		//failure
		if(!mapFile) 
		{
        	cout << "Couldn't open file " << argv[1] << " - did you spell it correctly? Aborting dd_mapconversion" << endl;
        	return -1;
    	}

		//success? output string
		cout << "original file: " << endl << inData << endl << endl;

		//replace the start of the each line with [
		string outData = "[" + inData;
		const char * replace = "\n[";
		size_t sPos = 0;

		

		while (sPos != string::npos) 
		{
			sPos = outData.find('\n', sPos);
			cout << sPos << endl;

			if (sPos != string::npos)
			{
				outData = outData.replace(sPos, 1, replace);
				sPos++;
			}
			

			// //need a way to bail when my logic fails.
			// int x = 0;
			// cin >> x;
			// if (x == -1)
			// {
			// 	return -1;
			// }
		}

		cout << "result: " << endl << outData << endl;
	}
	else
	{
		std::cout << "usage: dd_mapconv mapname.csv" << endl;
	}

	return 0;
}