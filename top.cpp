#include <bits/stdc++.h>
#include <iostream>
using namespace std;
string default_color = "#2E2EFF";
string white = "#ffffff";
bool flag_graph = 0;
bool flag_vector = 0;
bool flag_label = 0;

class Graph
{
private:
    map<pair<int, int>, string> edge_color;
    map<pair<int, int>, int> edge_label;
    map<pair<int, int>, int> edge_id;
    map<int, int> node_id;
    map<int, string> node_color;
    int nodes_count = 0;
    int edge_count = 0;
    void Print(bool is_first)
    {
        if (!flag_graph)
            return;
        if (!is_first)
            cout << ",";
        cout << "{";
        PrintNodes();
        PrintEdges();
        cout << "}";
    }

    void PrintNodes()
    {
        cout << "\"nodes\":[";
        int counter = 0;
        for (auto u : node_id)
        {
            counter++;
            if (counter > 1)
                cout << ",";
            cout << "{";
            cout << "\"id\":" << u.first << ","
                 << "\"label\":"
                 << "\"" << to_string(u.first) << "\""
                 << ","
                 << "\"color\":"
                 << "\"" << node_color[u.first] << "\"";
            cout << "}";
        }
        cout << "],";
    }

    void PrintEdges()
    {
        cout << "\"edges\":[";
        int counter = 0;
        for (auto u : edge_id)
        {
            counter++;
            if (counter > 1)
                cout << ",";
            cout << "{";
            cout << "\"id\":" << u.second << ",";
            if (flag_label)
                cout << "\"label\":"
                        "\""
                     << edge_label[u.first] << "\"";

            cout << "\"color\":"
                 << "\"" << edge_color[u.first] << "\""
                 << ","
                 << "\"from\":" << u.first.first
                 << ","
                 << "\"to\":" << u.first.second;
            cout << "}";
        }
        cout << "]";
    }

public:
    void AddNode(int label, string color)
    {
        nodes_count++;
        node_id[label] = label;
        node_color[label] = color;
        Print(0);
    }

    void AddNode(int label)
    {
        nodes_count++;
        node_id[label] = label;
        node_color[label] = default_color;
        Print(0);
    }

    void AddEdge(int from, int to, int label, string color)
    {
        flag_label = 1;
        edge_count++;
        edge_color[{from, to}] = color;
        edge_label[{from, to}] = label;
        edge_id[{from, to}] = edge_count;
        Print(0);
    }

    void AddEdge(int from, int to, int label)
    {
        flag_label = 1;
        edge_count++;
        edge_color[{from, to}] = default_color;
        edge_label[{from, to}] = label;
        edge_id[{from, to}] = edge_count;
        Print(0);
    }

    void AddEdge(int from, int to, string color)
    {
        edge_count++;
        edge_color[{from, to}] = color;
        edge_id[{from, to}] = edge_count;

        Print(0);
    }

    void AddEdge(int from, int to)
    {
        edge_count++;
        edge_color[{from, to}] = default_color;
        edge_id[{from, to}] = edge_count;
        Print(0);
    }

    void RemoveEdge(int from, int to)
    {
        edge_color[{from, to}] = white;
        Print(0);
    }
    void RemoveNode(int label)
    {
        node_color[label] = white;
        Print(0);
    }
    void ColorNode(int label, string color)
    {
        node_color[label] = color;
        Print(0);
    }
    void ColorNode(int label)
    {
        node_color[label] = default_color;
        Print(0);
    }
    void ColorEdge(int from, int to, string color)
    {
        edge_color[{from, to}] = color;
        Print(0);
    }
    void ColorEdge(int from, int to)
    {
        edge_color[{from, to}] = default_color;
        Print(0);
    }
    void EdgeLabel(int from, int to, int label)
    {
        edge_label[{from, to}] = label;
        flag_label = 1;
    }
    void CreateGraph()
    {
        flag_graph = 1;
        flag_vector = 0;
        Print(1);
    }
};

class Vector
{
private:
    vector<int> values;
    vector<string> colors;
    void Print(bool is_first)
    {
        if (!flag_vector)
            return;
        if (!is_first)
            cout << ",";
        cout << "{";
        PrintValues();
        PrintColors();
        PrintLabels();
        cout << "}";
    }
    void PrintValues()
    {
        cout << "\"values\":[";
        int counter = 0;
        for (auto u : values)
        {
            counter++;
            if (counter > 1)
                cout << ",";
            cout << u;
        }
        cout << "],";
    }
    void PrintColors()
    {
        cout << "\"colors\":[";
        int counter = 0;
        for (auto u : colors)
        {
            counter++;
            if (counter > 1)
                cout << ",";
            cout << "\"" << u << "\"";
        }
        cout << "],";
    }
    void PrintLabels()
    {
        cout << "\"labels\":[";
        int counter = 0;
        for (int i = 0; i < int(values.size()); i++)
        {
            counter++;
            if (counter > 1)
                cout << ",";
            cout << "\"" << i << "\"";
        }
        cout << "]";
    }

public:
    void PushBack(int val)
    {
        values.push_back(val);
        colors.push_back(default_color);
        Print(0);
    }
    void PushBack(int val, string color)
    {
        values.push_back(val);
        colors.push_back(color);
        Print(0);
    }
    void PopBack()
    {
        values.pop_back();
        colors.pop_back();
        Print(0);
    }
    void Swap(int i, int j, bool with_color)
    {
        swap(values[i], values[j]);
        if (with_color)
            swap(colors[i], colors[j]);
        Print(0);
    }
    void Swap(int i, int j, bool with_color, string color)
    {
        string ti = colors[i];
        string tj = colors[j];
        colors[i] = colors[j] = color;
        Print(0);
        swap(values[i], values[j]);
        Print(0);
        colors[i] = ti;
        colors[j] = tj;
        if (with_color)
            swap(colors[i], colors[j]);
        Print(0);
    }
    void SetColor(int i, string color)
    {
        colors[i] = color;
        Print(0);
    }
    void SetValue(int i, int val)
    {
        values[i] = val;
        Print(0);
    }
    void Sort(int i, int j, bool with_color)
    {
        sort(values.begin() + i, values.end() + j);
        if (with_color)
        {
            sort(colors.begin() + i, colors.end() + j);
        }
    }
    void Reverse(int i, int j, bool with_color)
    {
        reverse(values.begin() + i, values.end() + j);
        if (with_color)
        {
            reverse(colors.begin() + i, colors.end() + j);
        }
    }
    void Resize(int size)
    {
        values.resize(size);
        colors.resize(size);
    }
    void Assign(int size, int val, string color)
    {
        values.assign(size, val);
        colors.assign(size, color);
    }
    void Assign(int size, int val)
    {
        values.assign(size, val);
    }
    void CreateVector()
    {
        flag_vector = 1;
        flag_graph = 0;
        Print(1);
    }
};